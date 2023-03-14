import db from "../../db.js";
const COUNT_POST_PER_PAGE = 3;

class PostPostgressRepo {
  /* Отображение постов в топике */
  async getAllPostByTopicID(topicID) {
    const allPost = await db.query("SELECT * FROM post WHERE topic_id = $1", [
      topicID,
    ]);
    return allPost.rows;
  }
  async getSortedPostInfoByTopicID(topicID, offset, filter) {
    const query = this.#getSortedPostQuery(filter);
    const postsInfo = await db.query(query, [
      topicID,
      COUNT_POST_PER_PAGE,
      offset,
    ]);
    return postsInfo.rows;
  }
  #getSortedPostQuery(filter) {
    let filterString;
    switch (filter) {
      case "last-update": {
        filterString =
          "temp4.last_comment_date DESC NULLS LAST, temp1.date DESC";
        break;
      }
      case "title": {
        filterString = "temp1.title, temp1.date DESC";
        break;
      }
      case "last-date-create": {
        filterString = "temp1.date DESC";
        break;
      }
      case "most-view": {
        filterString = "temp2.count_view DESC, temp1.date DESC";
        break;
      }
      case "most-comment": {
        filterString = "temp4.count_comment DESC, temp1.date DESC";
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
  /* Отображение поста */
  async getPostInfoByID(postID) {
    const postInfo = await db.query(
      `
    SELECT post.id, post.title, post.fixed, post.closed, post.verified, person.id as author_id, 
      person.nick as author_nick_name, person.avatar as author_avatar, topic.id as topic_id, 
      topic.title as topic_title, post.date 
    FROM post
    LEFT JOIN person ON person.id = post.person_id
    LEFT JOIN topic ON topic.id = post.topic_id
    WHERE post.id = $1
    `,
      [postID]
    );
    return postInfo.rows;
  }
  /* Отображение последних постов */
  async getLastPosts() {
    const posts = await db.query(`
    WITH
    temp1 ("post_id", "count_comment") as (
    SELECT t1.id, count(t2.id)
    FROM post as t1
    LEFT JOIN comment as t2 ON t2.post_id = t1.id
    GROUP BY t1.id
    ORDER BY t1.date DESC 
    LIMIT 5
    ),
    temp2 ("post_id", "post_title", "post_date", "author_id", "author_avatar", "author_nick_name", 
        "topic_id", "topic_title", "count_comment") as (
    SELECT t1.id, t1.title, t1.date, t2.id, t2.avatar, t2.nick, t3.id, t3.title, t4.count_comment
    FROM post as t1
    RIGHT JOIN temp1 as t4 ON t4.post_id = t1.id
    LEFT JOIN person as t2 ON t2.id = t1.person_id
    LEFT JOIN topic as t3 ON t3.id = t1.topic_id
    )
    SELECT * FROM temp2
    ORDER BY post_date DESC
    `);

    return posts.rows;
  }
  /* Обновление поста */
  async getPostByID(postID) {
    const post = await db.query(`SELECT * FROM post WHERE id = $1`, [postID]);
    return post.rows;
  }
  async updatePostTitle(postID, title) {
    const result = await db.query(
      `
    UPDATE post
    SET title = $2
    WHERE id = $1
    RETURNING*
    `,
      [postID, title]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updatePostClosed(postID, value) {
    const result = await db.query(
      `
    UPDATE post
    SET closed = $2
    WHERE id = $1
    RETURNING*
    `,
      [postID, value]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updatePostVerified(postID, value) {
    const result = await db.query(
      `
    UPDATE post
    SET verified = $2
    WHERE id = $1
    RETURNING*
    `,
      [postID, value]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async getMainCommentByPostID(postID) {
    const mainComment = await db.query(
      `
    SELECT * FROM comment WHERE post_id = $1 AND main = true
    `,
      [postID]
    );
    return mainComment.rows;
  }
  async updateMainCommentVerified(postID, value) {
    const result = await db.query(
      `
    UPDATE comment
    SET verified = $2
    WHERE post_id = $1 AND main = true
    RETURNING*
    `,
      [postID, value]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updatePostFixed(postID, value) {
    const result = await db.query(
      `
    UPDATE post
    SET fixed = $2
    WHERE id = $1
    RETURNING*
    `,
      [postID, value]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Удаление поста */
  async deletePost(postID) {
    const result = await db.query(
      `
    DELETE FROM post WHERE id = $1
    RETURNING*
    `,
      [postID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Создание поста */
  async getTopicByID(topicID) {
    const topic = await db.query(`SELECT * FROM topic WHERE id = $1`, [
      topicID,
    ]);
    return topic.rows;
  }
  async createPost(topicID, userID, title, verified) {
    const date = new Date();
    const result = await db.query(
      `
    INSERT INTO post ("title", "person_id", "topic_id", "date", "closed", "verified", "fixed")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING*
    `,
      [title, userID, topicID, date, false, verified, false]
    );
    if (result.rows.length === 0) throw new Error();
  }
}

class PostRepo {
  constructor(repo) {
    this.repo = repo;
  }
  /* Отображение постов в топике */
  async getAllByTopicID(topicID, page, filter) {
    page = page ? page : 1;
    const offset = (page - 1) * COUNT_POST_PER_PAGE;
    const allPost = await this.repo.getAllPostByTopicID(topicID);
    const maxPage = Math.ceil(allPost.length / COUNT_POST_PER_PAGE);
    if (maxPage === 0 || page > maxPage) return { maxPage, posts: [] };

    const sortedPostsInfo = await this.repo.getSortedPostInfoByTopicID(
      topicID,
      offset,
      filter
    );
    const posts = [];

    for (const sortedPostInfo of sortedPostsInfo) {
      const lastComment = !sortedPostInfo.last_comment_id
        ? null
        : {
            userID: sortedPostInfo.last_comment_author_id,
            avatar: sortedPostInfo.last_comment_author_avatar,
            nickName: sortedPostInfo.last_comment_author_nick_name,
            date: sortedPostInfo.last_comment_date,
            commentID: sortedPostInfo.last_comment_id,
          };

      const post = {
        id: sortedPostInfo.post_id,
        title: sortedPostInfo.title,
        fixed: sortedPostInfo.fixed,
        closed: sortedPostInfo.closed,
        verified: sortedPostInfo.verified,
        date: sortedPostInfo.date,
        authorID: sortedPostInfo.author_post_id,
        authorNickName: sortedPostInfo.author_post_nick_name,
        viewCount: sortedPostInfo.count_view,
        countComment: sortedPostInfo.count_comment,
        lastComment,
      };
      posts.push(post);
    }

    return { posts, maxPage };
  }
  /* Отображение поста */
  async getOneByID(id) {
    const postInfo = await this.repo.getPostInfoByID(id);
    const post =
      postInfo?.length === 0
        ? null
        : {
            id: postInfo[0].id,
            title: postInfo[0].title,
            fixed: postInfo[0].fixed,
            closed: postInfo[0].closed,
            verified: postInfo[0].verified,
            authorID: postInfo[0].author_id,
            authorNickName: postInfo[0].author_nick_name,
            authorAvatar: postInfo[0].author_avatar,
            topicID: postInfo[0].topic_id,
            topicTitle: postInfo[0].topic_title,
            date: postInfo[0].date,
          };

    return post;
  }
  /* Отображение последних постов */
  async getLastPosts() {
    const postsInfo = await this.repo.getLastPosts();
    const posts = [];
    for (const postInfo of postsInfo) {
      const post = {
        postID: postInfo.post_id,
        postTitle: postInfo.post_title,
        postDate: postInfo.post_date,
        authorID: postInfo.author_id,
        authorAvatar: postInfo.author_avatar,
        authorNickName: postInfo.author_nick_name,
        topicID: postInfo.topic_id,
        topicTitle: postInfo.topic_title,
        countComment: postInfo.count_comment,
      };
      posts.push(post);
    }
    return posts;
  }
  /* Обновление поста */
  async getPostByID(postID) {
    const post = await this.repo.getPostByID(postID);
    return post;
  }
  async updatePostTitle(postID, title) {
    await this.repo.updatePostTitle(postID, title);
  }
  async updatePostClosed(postID, value) {
    await this.repo.updatePostClosed(postID, value);
  }
  async getMainCommentByPostID(postID) {
    const mainComment = await this.repo.getMainCommentByPostID(postID);
    return mainComment;
  }
  async updatePostVerified(postID, value) {
    await this.repo.updatePostVerified(postID, value);
    await this.repo.updateMainCommentVerified(postID, value);
  }
  async updatePostFixed(postID, value) {
    await this.repo.updatePostFixed(postID, value);
  }
  /* Удаление поста */
  async deletePost(postID) {
    await this.repo.deletePost(postID);
  }
  /* Создание поста */
  async isHasTopic(topicID) {
    const topic = await this.repo.getTopicByID(topicID);
    if (topic.length === 0) return false;
    else if (!topic[0]?.access_post) return false;
    return true;
  }
  async createPost(title, topicID, userID, userRole) {
    const verified = userRole === "noob" ? false : true;
    await this.repo.createPost(topicID, userID, title, verified);
  }
}

export default new PostRepo(new PostPostgressRepo());
