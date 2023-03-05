import db from "../../db.js";
const COUNT_COMMENT_PER_PAGE = 20;

class CommentPostgressRepo {
  async getAllByPostID(id, page) {
    const offset = (page - 1) * COUNT_COMMENT_PER_PAGE;

    const allComents = await db.query(
      "SELECT id FROM comment WHERE comment.post_id = $1",
      [id]
    );
    const maxPage = allComents.rows?.length || 0;
    if (maxPage === 0 || maxPage < page) return { comments: [], maxPage };

    const commentsInfo = await db.query(
      `
    WITH 
    temp1 ("id", "body", "main", "date", "verified", "fixed", "author_id", "author_nick_name", 
         "author_avatar", "author_role", "updated", "date_update", "author_update_id", "post_id" ) 
         as (SELECT T1.id, T1.body, T1.main, T1.date, T1.verified, T1.fixed, t2.id, t2.nick, t2.avatar, 
           t2.role, T1.updated, T1.date_update, T1.person_id_updated, T1.post_id
           FROM comment as T1 
           LEFT JOIN person as t2 ON t1.person_id = t2.id
          )
    SELECT temp1.*, person.nick as author_update_nick_name 
    FROM temp1
    LEFT JOIN person ON person.id = temp1.author_update_id
    WHERE post_id = $1
    ORDER BY temp1.main DESC, temp1.fixed DESC, temp1.date
    LIMIT $2 OFFSET $3
    `,
      [id, COUNT_COMMENT_PER_PAGE, offset]
    );
    const commentListID = [];
    const comments = [];
    for (const commentInfo of commentsInfo.rows) {
      commentListID.push(commentInfo.id);
    }
    if (commentListID.length === 0) return { comments, maxPage };

    const likesInfo = await db.query(
      `SELECT * FROM likes WHERE comment_id IN (${commentListID.join(", ")}) `
    );

    const likesArrayInfo = {};
    for (const likeInfo of likesInfo.rows) {
      const index = likeInfo.comment_id;
      const fromID = likeInfo.from;
      if (!likesArrayInfo[index]) likesArrayInfo[index] = [];
      likesArrayInfo[index].push(fromID);
    }

    for (const commentInfo of commentsInfo.rows) {
      const likes = likesArrayInfo[commentInfo.id];

      const comment = {
        id: commentInfo.id,
        body: commentInfo.body,
        main: commentInfo.body,
        authorID: commentInfo.author_id,
        authorNickName: commentInfo.author_nick_name,
        authorAvatar: commentInfo.author_avatar,
        authorRole: commentInfo.author_role,
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

    /*
    export interface IComment {
  id: number;
  body: string;
  main: boolean;
  authorNickName: string;
  authorID: number;
  authorAvatar: string;
  date: string;
  updated: boolean;
  dateUpdated: boolean;
  authorUpdateNickName: string;
  authorUpdateID: number;
  verified: boolean;
  fixied: boolean;
  likes: string[];
}
    */
  }
}

class CommentRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getAllByPostID(id, page) {
    return this.repo.getAllByPostID(id, page);
  }
}

export default new CommentRepo(new CommentPostgressRepo());
