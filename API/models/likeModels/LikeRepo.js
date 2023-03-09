import db from "../../db.js";

class LikePostgressRepo {
  async getAllByCommentID(id) {
    const likesInfo = await db.query(
      `
    SELECT t1.id, t1.from as from_id, t2.avatar as from_avatar, t2.nick as from_nick_name, t1.to, 
    t1.comment_id, t1.date 
    FROM likes as t1
    LEFT JOIN person as t2 ON t2.id = t1.from
    WHERE t1.comment_id = $1
    `,
      [id]
    );
    const likes = [];
    for (const likeInfo of likesInfo.rows) {
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
}

class LikeRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getAllByCommentID(id) {
    return this.repo.getAllByCommentID(id);
  }
}

export default new LikeRepo(new LikePostgressRepo());
