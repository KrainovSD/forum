import db from "../../db.js";
const COUNT_POST_PER_PAGE = 3;

class PostPostgressRepo {
  async getAllByTopicID(topicID, page, filter) {
    page = page ? page : 1;
    const offset = (page - 1) * COUNT_POST_PER_PAGE;
    const allPost = await db.query("SELECT * FROM post WHERE topic_id = $1", [
      topicID,
    ]);
    const maxPage = Math.ceil(allPost.rows.length / COUNT_POST_PER_PAGE);
    const query = this.#getSortedPostQuery(filter);
    const postsInfo = await db.query(query, [
      topicID,
      COUNT_POST_PER_PAGE,
      offset,
    ]);
    const posts = [];

    for (const postInfo of postsInfo.rows) {
      console.log(postInfo.last_comment_id);
      const lastComment = !postInfo.last_comment_id
        ? null
        : {
            userID: postInfo.last_comment_author_id,
            avatar: postInfo.last_comment_author_avatar,
            nickName: postInfo.last_comment_author_nick_name,
            date: postInfo.last_comment_date,
            commentID: postInfo.last_comment_id,
          };

      const post = {
        id: postInfo.post_id,
        title: postInfo.title,
        fixed: postInfo.fixed,
        closed: postInfo.closed,
        verified: postInfo.verified,
        date: postInfo.date,
        authorID: postInfo.author_post_id,
        authorNickName: postInfo.author_post_nick_name,
        viewCount: postInfo.count_view,
        countComment: postInfo.count_comment,
        lastComment,
      };
      posts.push(post);
    }

    return { posts, maxPage };
  }
  async getOneByID(id) {
    const postInfo = await db.query(
      `
    SELECT post.id, post.title, post.fixed, post.closed, post.verified, person.id as author_id, 
      person.nick as author_nick_name, topic.id as topic_id, topic.title as topic_title, post.date 
    FROM post
    LEFT JOIN person ON person.id = post.person_id
    LEFT JOIN topic ON topic.id = post.topic_id
    WHERE post.id = $1
    `,
      [id]
    );

    const post =
      postInfo?.rows?.length === 0
        ? null
        : {
            id: postInfo.rows[0].id,
            title: postInfo.rows[0].title,
            fixed: postInfo.rows[0].fixed,
            closed: postInfo.rows[0].closed,
            verified: postInfo.rows[0].verified,
            authorID: postInfo.rows[0].author_id,
            authorNickName: postInfo.rows[0].author_nick_name,
            topicID: postInfo.rows[0].topic_id,
            topicTitle: postInfo.rows[0].topic_title,
            date: postInfo.rows[0].date,
          };

    return post;
  }
  #getSortedPostQuery(filter) {
    let filterString;
    switch (filter) {
      case "last-update": {
        filterString = "temp4.last_comment_date DESC NULLS LAST";
        break;
      }
      case "title": {
        filterString = "temp1.title";
        break;
      }
      case "last-date-create": {
        filterString = "temp1.date DESC";
        break;
      }
      case "most-view": {
        filterString = "temp2.count_view DESC";
        break;
      }
      case "most-comment": {
        filterString = "temp4.count_comment DESC";
        break;
      }
      default: {
        filterString = "temp1.date DESC";
        break;
      }
    }

    const query = `
    WITH 
    temp1 ("post_id", "parent_id", "title", "fixed", "closed", "verified",  "date", 
           "author_post_id", "author_post_nick_name") 
      as (
      SELECT post.id, post.topic_id, post.title, post.fixed, post.closed, post.verified, 
        post.date, person.id, person.nick
      FROM post
      LEFT JOIN person ON post.person_id  = person.id
      ),
    temp2 ("post_id", "count_view")
      as (
      SELECT post.id, count(viewed_post.id)
      FROM post
      LEFT JOIN viewed_post ON viewed_post.post_id = post.id
      GROUP BY post.id
    ),
    temp3 ("post_id", "count_comment", "last_comment_date")
      as(
      SELECT post.id, COUNT(comment.id), MAX(comment.date)
      FROM post
      LEFT JOIN comment ON comment.post_id = post.id
      GROUP BY post.id
      ),
    temp4 ("post_id", "count_comment", "last_comment_date", "last_comment_id", "last_comment_author_id", 
         "last_comment_author_nick_name", "last_comment_author_avatar")
         as (
         SELECT temp3.post_id, temp3.count_comment, temp3.last_comment_date, comment.id, 
            person.id, person.nick, person.avatar
         FROM temp3
         LEFT JOIN comment ON comment.date = temp3.last_comment_date AND comment.post_id = temp3.post_id
         LEFT JOIN person ON person.id = comment.person_id
         )
         
    SELECT temp1."post_id", temp1."parent_id", temp1."title", temp1."fixed", temp1."closed", 
      temp1."verified", temp1."date", temp1."author_post_id", 
      temp1."author_post_nick_name", temp2."count_view", temp4."count_comment", temp4."last_comment_date",
      temp4."last_comment_id", temp4."last_comment_author_id", temp4."last_comment_author_nick_name", 
      temp4."last_comment_author_avatar"
    FROM temp1
    LEFT JOIN temp2 ON temp2.post_id = temp1.post_id
    LEFT JOIN temp4 ON temp4.post_id = temp1.post_id
    WHERE temp1.parent_id = $1 ORDER BY temp1.fixed DESC, ${filterString} LIMIT $2 OFFSET $3`;
    return query;
  }
}

class PostRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getAllByTopicID(topicID, page, filter) {
    return this.repo.getAllByTopicID(topicID, page, filter);
  }
  async getOneByID(id) {
    return this.repo.getOneByID(id);
  }
}

export default new PostRepo(new PostPostgressRepo());
