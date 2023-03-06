import db from "../../db.js";
const COUNT_COMMENT_PER_PAGE = 3;

class CommentPostgressRepo {
  async getAllByPostID(id, page) {
    const offset = (page - 1) * COUNT_COMMENT_PER_PAGE;

    const allComents = await db.query(
      "SELECT id FROM comment WHERE comment.post_id = $1",
      [id]
    );
    const maxPage = allComents.rows?.length
      ? Math.ceil(allComents.rows.length / COUNT_COMMENT_PER_PAGE)
      : 0;
    if (maxPage === 0 || maxPage < page) return { comments: [], maxPage: 0 };

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
        WHERE post_id = $1
        ORDER BY t1.main DESC, t1.fixed DESC, t1.date
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
