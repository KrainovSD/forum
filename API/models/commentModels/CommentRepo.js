import db from "../../db.js";
const COUNT_COMMENT_PER_PAGE = 3;

class CommentPostgressRepo {
  async getAllowComments(id, userID, userRole) {
    const verifySortAllComents = userID
      ? userRole == "moder" || userRole == "admin"
        ? `(verified = true OR verified = false)`
        : `(verified = true OR (verified = false AND person_id = ${userID}))`
      : `verified = true`;
    const allComents = await db.query(
      `SELECT id FROM comment WHERE comment.post_id = $1 AND ${verifySortAllComents}`,
      [id]
    );
    return allComents.rows;
  }
  async getCommentsInfoWithOffset(id, userID, userRole, offset) {
    const verifySortCommentInfo = userID
      ? userRole == "moder" || userRole == "admin"
        ? `(t1.verified = true OR t1.verified = false)`
        : `(t1.verified = true OR (t1.verified = false AND t1.author_id = ${userID}))`
      : `t1.verified = true`;
    const commentsInfo = await db.query(
      `
      WITH 
      temp1("id", "reputation") as (
      SELECT t1.id, count(t2.id)
        FROM person as t1
        LEFT JOIN likes as t2 ON t2.to = t1.id
        GROUP BY t1.id
      ),
      temp2("id", "count_comment") as (
      SELECT t1.id, count(t2.id)
        FROM person as t1
        LEFT JOIN comment as t2 ON t2.person_id = t1.id
        WHERE t2.verified = true
        GROUP BY t1.id
      ),
      temp3("id", "nick", "avatar", "role", "reputation", "count_comment") as (
      SELECT t1.id, t1.nick, t1.avatar, t1.role, t2.reputation, t3.count_comment
        FROM person as t1
        LEFT JOIN temp1 as t2 ON t2.id = t1.id
        LEFT JOIN temp2 as t3 ON t3.id = t1.id
      ),
        temp4 ("id", "body", "main", "date", "verified", "fixed", "author_id", "author_nick_name", 
             "author_avatar", "author_role", "author_reputation", "author_count_comment", "updated", 
           "date_update", "author_update_id", "post_id" ) 
             as (SELECT t1.id, t1.body, t1.main, t1.date, t1.verified, t1.fixed, t2.id, t2.nick, t2.avatar, 
               t2.role, t2.reputation, t2.count_comment, t1.updated, t1.date_update, t1.person_id_updated, 
           t1.post_id
               FROM comment as t1 
               LEFT JOIN temp3 as t2 ON t1.person_id = t2.id
              )
          
        SELECT t1.*, t2.nick as author_update_nick_name
        FROM temp4 as t1
        LEFT JOIN person as t2 ON t2.id = t1.author_update_id
        WHERE t1.post_id = $1 AND ${verifySortCommentInfo}
        ORDER BY t1.main DESC, t1.fixed DESC, t1.date
        LIMIT $2 OFFSET $3
    `,
      [id, COUNT_COMMENT_PER_PAGE, offset]
    );
    return commentsInfo.rows;
  }
  async getLikesInfoByCommentID(commentList) {
    const likesInfo = await db.query(
      `SELECT * FROM likes WHERE comment_id = ANY($1)`,
      [commentList]
    );
    return likesInfo.rows;
  }
  async getPostByID(id) {
    const post = await db.query("SELECT * FROM post WHERE id = $1", [id]);
    return post.rows;
  }
  async createComment(comment) {
    const result = await db.query(
      `INSERT INTO comment ("body", "person_id", "post_id", "date", "updated", "verified", "fixed", "main") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING*`,
      [
        comment.body,
        comment.personID,
        comment.postID,
        comment.date,
        comment.updated,
        comment.verified,
        comment.fixed,
        comment.main,
      ]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async getComment(commentID) {
    const comment = await db.query("SELECT * FROM comment WHERE id = $1", [
      commentID,
    ]);
    return comment.rows;
  }
  async deleteComment(commentID) {
    const result = await db.query(
      `DELETE FROM comment WHERE id = $1 RETURNING*`,
      [commentID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateCommentBody(commentID, body, userID) {
    const now = new Date();
    const result = await db.query(
      `UPDATE comment SET body = $1, updated = true, person_id_updated = $3, date_update = $4 WHERE id = $2 RETURNING*`,
      [body, commentID, userID, now]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateCommentVerified(commentID, verified) {
    const result = await db.query(
      `UPDATE comment SET verified = $1 WHERE id = $2 RETURNING*`,
      [verified, commentID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateCommentFixed(commentID, fixed) {
    const result = await db.query(
      `UPDATE comment SET fixed = $1 WHERE id = $2 RETURNING*`,
      [fixed, commentID]
    );
    if (result.rows.length === 0) throw new Error();
  }
}

class CommentRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getAllByPostID(id, page, userID, userRole) {
    /* find max page */
    const offset = (page - 1) * COUNT_COMMENT_PER_PAGE;
    const allowComments = await this.repo.getAllowComments(
      id,
      userID,
      userRole
    );
    const maxPage = allowComments?.length
      ? Math.ceil(allowComments.length / COUNT_COMMENT_PER_PAGE)
      : 0;
    if (maxPage === 0 || maxPage < page) return { comments: [], maxPage: 0 };
    /* find comments Info */
    const commentsInfo = await this.repo.getCommentsInfoWithOffset(
      id,
      userID,
      userRole,
      offset
    );
    const commentListID = [];
    for (const commentInfo of commentsInfo) {
      commentListID.push(commentInfo.id);
    }
    if (commentListID.length === 0) return { comments: [], maxPage };
    /* find likes info */
    const likesInfo = await this.repo.getLikesInfoByCommentID(commentListID);
    const likesArrayInfo = {};
    for (const likeInfo of likesInfo) {
      const index = likeInfo.comment_id;
      const fromID = likeInfo.from;
      if (!likesArrayInfo[index]) likesArrayInfo[index] = [];
      likesArrayInfo[index].push(fromID);
    }
    /* find result  */
    const comments = [];
    for (const commentInfo of commentsInfo) {
      const likes = likesArrayInfo[commentInfo.id];

      const comment = {
        id: commentInfo.id,
        body: commentInfo.body,
        main: commentInfo.main,
        authorID: commentInfo.author_id,
        authorNickName: commentInfo.author_nick_name,
        authorAvatar: commentInfo.author_avatar,
        authorRole: commentInfo.author_role,
        authorReputation: commentInfo.author_reputation,
        authorCountComment: commentInfo.author_count_comment,
        date: commentInfo.date,
        updated: commentInfo.updated,
        dateUpdate: commentInfo.date_update,
        authorUpdateNickName: commentInfo.author_update_nick_name,
        authorUpdateID: commentInfo.author_update_id,
        verified: commentInfo.verified,
        fixed: commentInfo.fixed,
        likes: likes || [],
      };
      comments.push(comment);
    }

    return { comments, maxPage };
  }
  async isHasPostAndVerify(postID, userID) {
    const post = await this.repo.getPostByID(postID);
    if (post?.length === 0) return false;
    else if (!post[0]?.verified && post[0]?.person_id !== userID) return false;
    return true;
  }
  async isHasPostAndOpen(postID) {
    const post = await this.repo.getPostByID(postID);
    if (post?.length === 0 || post?.[0]?.closed) return false;
    return true;
  }
  async createComment(body, postID, main, userID, role) {
    const newComment = {
      body,
      personID: userID,
      postID,
      date: new Date(),
      updated: false,
      verified: role === "noob" ? false : true,
      fixed: false,
      main,
    };
    await this.repo.createComment(newComment);
  }
  async getComment(commentID) {
    return await this.repo.getComment(commentID);
  }
  async deleteComment(commentID) {
    await this.repo.deleteComment(commentID);
  }
  async updateCommentBody(commentID, body, userID) {
    await this.repo.updateCommentBody(commentID, body, userID);
  }
  async updateCommentVerified(commentID, verified) {
    await this.repo.updateCommentVerified(commentID, verified);
  }
  async updateCommentFixed(commentID, fixed) {
    await this.repo.updateCommentFixed(commentID, fixed);
  }
}

export default new CommentRepo(new CommentPostgressRepo());
