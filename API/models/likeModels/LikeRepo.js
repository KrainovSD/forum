import db from "../../db.js";

class LikePostgressRepo {
  async getLikesByCommentID(commentID) {
    const likesInfo = await db.query(
      `
    SELECT t1.id, t1.from as from_id, t2.avatar as from_avatar, t2.nick as from_nick_name, t1.to, 
    t1.comment_id, t1.date 
    FROM likes as t1
    LEFT JOIN person as t2 ON t2.id = t1.from
    WHERE t1.comment_id = $1
    `,
      [commentID]
    );
    return likesInfo.rows;
  }
  async getCommentByIDAndAuthorID(commentID, authorID) {
    const comment = await db.query(
      "SELECT * FROM comment WHERE id = $1 AND person_id = $2",
      [commentID, authorID]
    );
    return comment.rows;
  }
  async getLikeByCommentIDAndAuthorID(commentID, authorLike) {
    const like = await db.query(
      `SELECT * FROM likes WHERE comment_id = $1 AND "from" = $2`,
      [commentID, authorLike]
    );
    return like.rows;
  }
  async createLike(commentID, authorComment, authorLike) {
    const date = new Date();
    const create = await db.query(
      `INSERT INTO likes ("from", "to", "comment_id", "date") VALUES ($1, $2, $3, $4) RETURNING*`,
      [authorLike, authorComment, commentID, date]
    );
    if (create.rows.length === 0) throw new Error("");
  }
  async deleteLike(commentID, authorLike) {
    const deleteLike = await db.query(
      `DELETE FROM likes WHERE comment_id = $1 and "from" = $2 RETURNING*`,
      [commentID, authorLike]
    );
    if (deleteLike.rows.length === 0) throw new Error("");
  }
}

class LikeRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getAllByCommentID(commentID) {
    const likesInfo = await this.repo.getLikesByCommentID(commentID);

    const likes = [];
    for (const likeInfo of likesInfo) {
      const like = {
        id: likeInfo.id,
        fromID: likeInfo.from_id,
        fromAvatar: likeInfo.from_avatar,
        fromNickName: likeInfo.from_nick_name,
        to: likeInfo.to,
        commentID: likeInfo.comment_id,
        date: likeInfo.date,
      };
      likes.push(like);
    }

    return { likes };
  }
  async isHasComment(commentID, authorID) {
    const comment = await this.repo.getCommentByIDAndAuthorID(
      commentID,
      authorID
    );
    if (comment.length === 0) return false;
    return true;
  }
  async isHasLike(commentID, authorLike) {
    const like = await this.repo.getLikeByCommentIDAndAuthorID(
      commentID,
      authorLike
    );
    if (like.length !== 0) return true;
    return false;
  }
  async createLike(commentID, authorComment, authorLike) {
    await this.repo.createLike(commentID, authorComment, authorLike);
  }
  async deleteLike(commentID, authorLike) {
    await this.repo.deleteLike(commentID, authorLike);
  }
}

export default new LikeRepo(new LikePostgressRepo());
