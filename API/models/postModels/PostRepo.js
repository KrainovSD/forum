import db from "../../db.js";
import { COUNT_POST_PER_PAGE } from "../../const.js";

class PostPostgressRepo {
  #getPostInfoQuery = `
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
  `;
  #getPostInfoQueryForAuthUsers = `
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
       ),
  temp5("post_id", "viewed") AS (
  SELECT t1.id, t2.id
    FROM post as t1
    LEFT JOIN viewed_post as t2 ON t1.id = t2.post_id AND t2.person_id = $1 AND t2.updated = false
  )
      

    SELECT temp1."post_id", temp1."parent_id", temp1."title", temp1."fixed", temp1."closed", 
    temp1."verified", temp1."date", temp1."author_post_id", 
    temp1."author_post_nick_name", temp2."count_view", temp4."count_comment", temp4."last_comment_date",
    temp4."last_comment_id", temp4."last_comment_author_id", temp4."last_comment_author_nick_name", 
    temp4."last_comment_author_avatar", temp5.viewed
      FROM temp1
      LEFT JOIN temp2 ON temp2.post_id = temp1.post_id
      LEFT JOIN temp4 ON temp4.post_id = temp1.post_id     
      LEFT JOIN temp5 ON temp5.post_id = temp1.post_id
  `;

  /* Отображение постов в топике */
  async getByTopicID(topicID, userID, userRole) {
    const condition = userID
      ? userRole === "admin" || userRole === "moder"
        ? `(verified = true OR verified = false)`
        : `(verified = true OR (verified = false AND person_id = ${userID}))`
      : `verified = true`;

    const allPost = await db.query(
      `SELECT * FROM post WHERE topic_id = $1 AND ${condition}`,
      [topicID]
    );
    return allPost.rows;
  }
  async getSortedPostInfoByTopicID(topicID, offset, filter, userID, userRole) {
    const verifyCondition = userID
      ? userRole === "admin" || userRole === "moder"
        ? `(temp1.verified = true OR temp1.verified = false)`
        : `(temp1.verified = true OR (temp1.verified = false AND temp1.author_post_id = ${userID}))`
      : `temp1.verified = true`;
    const sortCondition = this.#getSortedPostQuery(filter);

    const fullQuery = userID
      ? `${this.#getPostInfoQueryForAuthUsers} 
    WHERE temp1.parent_id = $2 AND ${verifyCondition}
    ORDER BY temp1.fixed DESC, ${sortCondition} 
    LIMIT $3 OFFSET $4`
      : `
    ${this.#getPostInfoQuery} 
    WHERE temp1.parent_id = $1 AND ${verifyCondition}
    ORDER BY temp1.fixed DESC, ${sortCondition} 
    LIMIT $2 OFFSET $3`;
    const variable = userID
      ? [userID, topicID, COUNT_POST_PER_PAGE, offset]
      : [topicID, COUNT_POST_PER_PAGE, offset];

    const postsInfo = await db.query(fullQuery, variable);
    return postsInfo.rows;
  }
  #getSortedPostQuery(filter) {
    switch (filter) {
      case "last-update": {
        return "temp4.last_comment_date DESC NULLS LAST, temp1.date DESC";
      }
      case "title": {
        return "temp1.title, temp1.date DESC";
      }
      case "last-date-create": {
        return "temp1.date DESC";
      }
      case "most-view": {
        return "temp2.count_view DESC, temp1.date DESC";
      }
      case "most-comment": {
        return "temp4.count_comment DESC, temp1.date DESC";
      }
      case "no-verify": {
        return "temp1.verified, temp1.date DESC";
      }
      default: {
        return "temp1.date DESC";
      }
    }
  }
  /* Отображение поста */
  async getPostInfoByID(postID, userID, userRole) {
    const condition = userID
      ? userRole === "admin" || userRole === "moder"
        ? `(post.verified = true OR post.verified = false)`
        : `(post.verified = true OR (post.verified = false AND post.person_id = ${userID}))`
      : `post.verified = true`;

    const postInfo = await db.query(
      `
    SELECT post.id, post.title, post.fixed, post.closed, post.verified, person.id as author_id, 
      person.nick as author_nick_name, person.avatar as author_avatar, topic.id as topic_id, 
      topic.title as topic_title, post.date 
    FROM post
    LEFT JOIN person ON person.id = post.person_id
    LEFT JOIN topic ON topic.id = post.topic_id
    WHERE post.id = $1 AND ${condition}
    `,
      [postID]
    );
    return postInfo.rows;
  }
  async getViewedInfo(id, userID) {
    const viewed = await db.query(
      `
    SELECT * FROM viewed_post
    WHERE post_id = $1 AND person_id = $2
    `,
      [id, userID]
    );
    return viewed.rows;
  }
  async switchUpdatedView(id, userID, value) {
    const result = await db.query(
      `
    UPDATE viewed_post
    SET updated = $3
    WHERE post_id = $1 AND person_id = $2
    RETURNING*
    `,
      [id, userID, value]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async addView(id, userID) {
    const result = await db.query(
      `
    INSERT INTO viewed_post
    ("post_id", "person_id", "updated")
    VALUES 
    ($1, $2, $3)
    RETURNING*
    `,
      [id, userID, false]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Отображение последних постов */
  async getLastPosts() {
    const posts = await db.query(`
    WITH
    temp1 ("post_id", "count_comment") as (
    SELECT t1.id, count(t2.id)
    FROM post as t1
    LEFT JOIN comment as t2 ON t2.post_id = t1.id
    WHERE t1.verified = true
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
  /* Отображение всех доступных постов */
  async getAll() {
    const posts = await db.query(`SELECT * FROM post`);
    return posts.rows;
  }
  async getAllSorted(offset, filter, userID) {
    const filterString = this.#getSortedPostQuery(filter);
    const posts = await db.query(
      `
    ${this.#getPostInfoQueryForAuthUsers} 
    ORDER BY ${filterString}
    LIMIT $2 OFFSET $3

    `,
      [userID, COUNT_POST_PER_PAGE, offset]
    );
    return posts.rows;
  }
  /* Отображение постов пользователя */
  async getByUserID(userID, reqUserID, reqUserRole) {
    const condition = reqUserID
      ? reqUserRole === "admin" ||
        reqUserRole === "moder" ||
        userID == reqUserID
        ? `(verified = true OR verified = false)`
        : `verified = true`
      : `verified = true`;

    const allPost = await db.query(
      `SELECT * FROM post WHERE person_id = $1 AND ${condition}`,
      [userID]
    );
    return allPost.rows;
  }
  async getSortedByUserID(userID, offset, filter, reqUserID, reqUserRole) {
    const verifyCondition = reqUserID
      ? reqUserRole === "admin" ||
        reqUserRole === "moder" ||
        reqUserID == userID
        ? `(temp1.verified = true OR temp1.verified = false)`
        : `temp1.verified = true`
      : `temp1.verified = true`;
    const sortCondition = this.#getSortedPostQuery(filter);

    const fullQuery = userID
      ? `${this.#getPostInfoQueryForAuthUsers} 
      WHERE temp1.author_post_id = $2 AND ${verifyCondition}
      ORDER BY  ${sortCondition} 
      LIMIT $3 OFFSET $4`
      : `
    ${this.#getPostInfoQuery} 
    WHERE temp1.author_post_id = $1 AND ${verifyCondition}
    ORDER BY  ${sortCondition} 
    LIMIT $2 OFFSET $3`;
    const variable = userID
      ? [reqUserID, userID, COUNT_POST_PER_PAGE, offset]
      : [userID, COUNT_POST_PER_PAGE, offset];

    const postsInfo = await db.query(fullQuery, variable);

    return postsInfo.rows;
  }
  /* Обновление поста */
  async getPostByID(postID) {
    const post = await db.query(`SELECT * FROM post WHERE id = $1`, [postID]);
    return post.rows;
  }
  async updatePost(postID, title, topicID) {
    const result = await db.query(
      `
    UPDATE post
    SET title = $2, topic_id = $3
    WHERE id = $1
    RETURNING*
    `,
      [postID, title, topicID]
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
    const date = new Date();
    const result = await db.query(
      `
    UPDATE post
    SET verified = $2, date = $3
    WHERE id = $1
    RETURNING*
    `,
      [postID, value, date]
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
    return result.rows;
  }
  async createComment(body, postID, userID, verified) {
    const date = new Date();
    const result = await db.query(
      `
    INSERT INTO comment ("body", "person_id", "post_id", "date", "updated", "verified", "fixed", "main")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING*
    `,
      [body, userID, postID, date, false, verified, false, true]
    );
    if (result.rows.length === 0) throw new Error();
  }

  async switchAllUpdatedView(postID, userID, value) {
    const result = await db.query(
      `
      UPDATE viewed_post
      SET updated = $3
      WHERE post_id = $1 AND NOT person_id = $2
    `,
      [postID, userID, value]
    );
    console.log(result.rows);
  }

  async getParentInfo(postID) {
    const contents = await db.query(
      `
    WITH RECURSIVE
    temp1 (id, parent_id, path_id, path_title, LEVEL, post_title) 
    AS (SELECT T1.id, T1.parent_id,
        cast (array[T1."id"] as integer[]),
		cast (array[T1."title"] as varchar[]),
		1,
		post.title
        FROM topic T1
		RIGHT JOIN post ON post.topic_id = T1.id AND post.id = $1
    union
    select T2.id, T2.parent_id,
        cast(temp1.path_id || T2."id" as integer[]),
		cast (temp1.path_title || T2."title" as varchar[]),
		LEVEL + 1,
		temp1.post_title
        FROM topic T2 INNER JOIN temp1 ON ( temp1."parent_id"= T2."id"))
		
    SELECT * 
    FROM temp1 
    WHERE id IS NOT NULL
    ORDER BY LEVEL DESC 
    LIMIT 1
    
    `,
      [postID]
    );
    return contents.rows;
  }
}

class PostRepo {
  constructor(repo) {
    this.repo = repo;
  }
  #getPostsFromPostsInfo(postsInfo) {
    const posts = [];
    for (const sortedPostInfo of postsInfo) {
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
        viewed: sortedPostInfo.viewed ? true : false,
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
    return posts;
  }
  /* Информация о контенте */
  async getParentInfo(postID) {
    const parents = await this.repo.getParentInfo(postID);
    if (parents.length === 0) return null;

    if (parents[0].path_id.length !== parents[0].path_title.length) return null;

    const topicInfo = [];
    for (const index in parents[0].path_id) {
      const topic = {
        topicID: parents[0].path_id[index],
        topicTitle: parents[0].path_title[index],
      };
      topicInfo.push(topic);
    }
    const parentsInfo = {
      topicInfo: topicInfo.reverse(),
      postTitle: parents[0].post_title,
    };
    return parentsInfo;
  }
  /* Отображение постов в топике */
  async getByTopicID(topicID, page, filter, userID, userRole) {
    const offset = (page - 1) * COUNT_POST_PER_PAGE;
    const allPost = await this.repo.getByTopicID(topicID, userID, userRole);

    const maxPage = Math.ceil(allPost.length / COUNT_POST_PER_PAGE);
    if (maxPage === 0 || page > maxPage) return { maxPage, posts: [] };

    const sortedPostsInfo = await this.repo.getSortedPostInfoByTopicID(
      topicID,
      offset,
      filter,
      userID,
      userRole
    );

    const posts = this.#getPostsFromPostsInfo(sortedPostsInfo);

    return { posts, maxPage };
  }
  /* Отображение поста */
  async getOneByID(id, userID, userRole) {
    const postInfo = await this.repo.getPostInfoByID(id, userID, userRole);
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
  async getViewedInfo(id, userID) {
    const viewed = await this.repo.getViewedInfo(id, userID);
    if (viewed.length === 0) return { viewed: false, updated: false };
    return { viewed: true, updated: viewed[0].updated };
  }
  async switchUpdatedView(id, userID, value) {
    await this.repo.switchUpdatedView(id, userID, value);
  }
  async addView(id, userID) {
    await this.repo.addView(id, userID);
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
  /* Отображение всех доступных постов */
  async getAll(page, filter, userID) {
    const offset = (page - 1) * COUNT_POST_PER_PAGE;
    const allPost = await this.repo.getAll();

    const maxPage = Math.ceil(allPost.length / COUNT_POST_PER_PAGE);
    if (maxPage === 0 || page > maxPage) return { maxPage, posts: [] };

    const sortedPostsInfo = await this.repo.getAllSorted(
      offset,
      filter,
      userID
    );

    const posts = this.#getPostsFromPostsInfo(sortedPostsInfo);

    return { posts, maxPage };
  }
  /* Отображение постов пользователя */
  async getByUserID(userID, page, filter, reqUserID, reqUserRole) {
    const offset = (page - 1) * COUNT_POST_PER_PAGE;
    const allPost = await this.repo.getByUserID(userID, reqUserID, reqUserRole);

    const maxPage = Math.ceil(allPost.length / COUNT_POST_PER_PAGE);
    if (maxPage === 0 || page > maxPage) return { maxPage, posts: [] };

    const sortedPostsInfo = await this.repo.getSortedByUserID(
      userID,
      offset,
      filter,
      reqUserID,
      reqUserRole
    );

    const posts = this.#getPostsFromPostsInfo(sortedPostsInfo);

    return { posts, maxPage };
  }
  /* Обновление поста */
  async getPostByID(postID) {
    const post = await this.repo.getPostByID(postID);
    return post;
  }
  async updatePost(postID, title, topicID) {
    await this.repo.updatePost(postID, title, topicID);
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
  }

  async updatePostFixed(postID, value) {
    await this.repo.updatePostFixed(postID, value);
  }
  /* Удаление поста */
  async deletePost(postID) {
    await this.repo.deletePost(postID);
  }
  /* Создание поста */
  async getTopicByID(topicID) {
    const topic = await this.repo.getTopicByID(topicID);
    return topic;
  }
  async createPost(title, topicID, userID, userRole) {
    const verified = userRole === "noob" ? false : true;
    const post = await this.repo.createPost(topicID, userID, title, verified);
    if (post.length !== 1) throw new Error();
    return post[0];
  }
  async createComment(body, postID, userID, userRole) {
    const verified = userRole === "noob" ? false : true;
    await this.repo.createComment(body, postID, userID, verified);
  }

  async switchAllUpdatedView(postID, userID, value) {
    await this.repo.switchAllUpdatedView(postID, userID, value);
  }
}

export default new PostRepo(new PostPostgressRepo());
