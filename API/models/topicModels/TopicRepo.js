import db from "../../db.js";

class TopicPostgressRepo {
  async getAllByID(id) {
    let getTopics;
    let getTopicsInfo;
    let getParentTopic;

    if (id === "null") {
      getTopics = await db.query("select * from topic WHERE parent_id is NULL");

      getTopicsInfo =
        await db.query(`WITH RECURSIVE temp1 ( "id","parent_id","title", "access_post", LEAD, PATH, LEVEL) 
      AS (SELECT T1."id",T1."parent_id", T1."title", T1."access_post",
          cast (T1."id" as integer),
          cast (array[T1."id"] as integer[]) , 1
          FROM topic T1 WHERE parent_id is NULL
      union
      select T2."id", T2."parent_id", T2."title", T2."access_post",
          cast( temp1.LEAD as integer),
          cast(temp1.PATH || T2."id" as integer[]) , LEVEL + 1
           FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
           
      select temp1.id as id, temp1.title as title, temp1.access_post as access_post,
      temp1.parent_id as parent_id, temp1.LEAD as main_parent, temp1.PATH as path,
      person.id as user_id, person.avatar as avatar, person.nick as nick_name,
      post.title as post_title, post.id as post_id, comment.date as date 
      from temp1 
      LEFT JOIN post on temp1.id = post.topic_id
      LEFT JOIN comment on post.id = comment.post_id 
      LEFT JOIN person on comment.person_id = person.id
      ORDER BY temp1.PATH`);
    } else {
      getParentTopic = await db.query("SELECT title FROM topic WHERE id = $1", [
        id,
      ]);

      getTopics = await db.query("SELECT * FROM topic WHERE parent_id = $1", [
        id,
      ]);

      getTopicsInfo = await db.query(
        `WITH RECURSIVE temp1 ( "id","parent_id","title", "access_post", LEAD, PATH, LEVEL) 
      AS (SELECT T1."id",T1."parent_id", T1."title", T1."access_post",
          cast (T1."id" as integer),
          cast (array[T1."id"] as integer[]) , 1
          FROM topic T1 WHERE parent_id = $1
      union
      select T2."id", T2."parent_id", T2."title", T2."access_post",
          cast( temp1.LEAD as integer),
          cast(temp1.PATH || T2."id" as integer[]) , LEVEL + 1
           FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
           
      select temp1.id as id, temp1.title as title, temp1.access_post as access_post,
      temp1.parent_id as parent_id, temp1.LEAD as main_parent, temp1.PATH as path,
      person.id as user_id, person.avatar as avatar, person.nick as nick_name,
      post.title as post_title, post.id as post_id, comment.date as date 
      from temp1 
      LEFT JOIN post on temp1.id = post.topic_id
      LEFT JOIN comment on post.id = comment.post_id 
      LEFT JOIN person on comment.person_id = person.id
      ORDER BY temp1.PATH`,
        [id]
      );
    }
    /*
export interface topicType {
  id: number;
  title: string;
  accessPost: boolean;
  subTitleList: string[];
  countComment: number;
  lastComment: lastComment;
}

interface lastComment {
  userID: number;
  avatar: boolean;
  nickName: string;
  postTitle: string;
  postID: number;
  date: Date;
}*/

    const topics = [];
    const parentTopicTitle =
      getParentTopic && getParentTopic?.rows?.[0]?.title
        ? getParentTopic.rows[0].title
        : null;

    for (let topicItem of getTopics.rows) {
      const id = topicItem.id;
      const topicInfo = getTopicsInfo.rows.filter(
        (item) => item.main_parent === id
      );

      const comments = topicInfo
        .filter((item) => item.date !== null)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

      const title = topicItem.title;
      const accessPost = topicItem.access_post;
      const subTitleList = [];
      for (let value of topicInfo) {
        if (value.parent_id == id)
          subTitleList.push({ id: value.id, title: value.title });
      }
      const countComment = comments.length;

      let lastComment;
      if (countComment === 0) lastComment = null;
      else {
        const lastCommentInfo = comments[0];

        lastComment = {
          userID: lastCommentInfo.user_id,
          avatar: lastCommentInfo.avatar,
          nickName: lastCommentInfo.nick_name,
          postTitle: lastCommentInfo.post_title,
          postID: lastCommentInfo.post_id,
          date: lastCommentInfo.date,
        };
      }

      const topic = {
        id,
        title,
        accessPost,
        subTitleList,
        countComment,
        lastComment,
      };
      topics.push(topic);
    }

    return { topics, parentTitle: parentTopicTitle };
  }
}

class TopicRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getAllByID(id) {
    return this.repo.getAllByID(id);
  }
}

export default new TopicRepo(new TopicPostgressRepo());

/*
export interface topicType {
  id: number;
  title: string;
  subTitleList: string[];
  accessPost: boolean;
  countComment: number;
  lastComment: lastComment;
}

interface lastComment {
  userID: number;
  avatar: boolean;
  nickName: string;
  postTitle: string;
  postID: number;
  date: Date;
}

WITH RECURSIVE temp1 ( "id","parent_id","title", "access_post", LEAD, PATH, LEVEL) 
AS (SELECT T1."id",T1."parent_id", T1."title", T1."access_post",
	cast (T1."id" as integer),
	cast (array[T1."id"] as integer[]) , 1
    FROM topic T1 WHERE parent_id is NULL
union
select T2."id", T2."parent_id", T2."title", T2."access_post",
	cast( temp1.LEAD as integer),
	cast(temp1.PATH || T2."id" as integer[]) , LEVEL + 1
     FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
	 
select temp1.id as id, temp1.title as title, temp1.access_post as accessPost,
person.id as userID, person.avatar as avatar, person.nick as nickName,
post.title as postTitle, post.id as postID, comment.date as date 
from temp1 
LEFT JOIN post on temp1.id = post.topic_id
LEFT JOIN comment on post.id = comment.post_id 
LEFT JOIN person on comment.person_id = person.id
WHERE temp1.parent_id IS NULL
ORDER BY comment.date DESC

*/
