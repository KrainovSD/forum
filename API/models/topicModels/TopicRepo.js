import db from "../../db.js";

class TopicPostgressRepo {
  /* Отображение топиков */
  async getTopicsByParentID(parentID) {
    let allTopics;
    if (parentID === "null")
      allTopics = await db.query("select * from topic WHERE parent_id is NULL");
    else
      allTopics = await db.query("SELECT * FROM topic WHERE parent_id = $1", [
        parentID,
      ]);

    return allTopics.rows;
  }
  async getChildren(parentID) {
    let childTopics;
    if (parentID === "null")
      childTopics = await db.query(`
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
        
    select temp1.id as id, temp1.title as title, temp1.access_post as access_post,
    temp1.parent_id as parent_id, temp1.LEAD as main_parent, temp1.PATH as path,
    person.id as user_id, person.avatar as avatar, person.nick as nick_name,
    post.title as post_title, post.id as post_id, comment.date as date 
    from temp1 
    LEFT JOIN post on temp1.id = post.topic_id
    LEFT JOIN comment on post.id = comment.post_id 
    LEFT JOIN person on comment.person_id = person.id
    ORDER BY temp1.PATH
  `);
    else
      childTopics = await db.query(
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
          ORDER BY temp1.PATH
  `,
        [parentID]
      );
    return childTopics.rows;
  }
  async getAllChildren(topicID) {
    const children = await db.query(
      `
    WITH RECURSIVE temp1 ( "id","parent_id","title", "access_post") 
    AS (SELECT T1."id",T1."parent_id", T1."title", T1."access_post"
        FROM topic T1 WHERE parent_id = $1
    union
    select T2."id", T2."parent_id", T2."title", T2."access_post"
        FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
		
    SELECT * FROM temp1
    `,
      [topicID]
    );
    return children.rows;
  }
  async getAll() {
    const topics =
      await db.query(`WITH RECURSIVE temp1 ( "id","parent_id","title", "access_post", LEAD, LEVEL) 
    AS (SELECT T1."id",T1."parent_id", T1."title", T1."access_post",
        cast (T1."id" as integer), 1
        FROM topic T1 WHERE parent_id is NULL
    union
    select T2."id", T2."parent_id", T2."title", T2."access_post",
        cast( temp1.LEAD as integer),LEVEL + 1
        FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
        
    select * FROM temp1`);
    return topics.rows;
  }
  /* Обновление топиков */
  async getTopicByID(topicID) {
    const topic = await db.query(
      `
    SELECT t1.*, t2.title as parent_title
    FROM topic as t1
    LEFT JOIN topic as t2 ON t1.parent_id = t2.id
    WHERE t1.id = $1
    `,
      [topicID]
    );
    return topic.rows;
  }
  async updateTopic(topicID, title, access, parentID) {
    const result = await db.query(
      `
    UPDATE topic
    SET title = $2, access_post = $3, parent_id = $4
    WHERE id = $1
    RETURNING*
    `,
      [topicID, title, access, parentID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateTopicAccess(topicID, value) {
    const result = await db.query(
      `
    UPDATE topic
    SET access_post = $2
    WHERE id = $1
    RETURNING*
    `,
      [topicID, value]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Создание постов */
  async createTopic(title, access, parentID) {
    let result;
    if (parentID === "null")
      result = await db.query(
        `
    INSERT INTO topic ("title", "access_post")
    VALUES ($1, $2)
    RETURNING*
  `,
        [title, access]
      );
    else
      result = await db.query(
        `
      INSERT INTO topic ("title", "access_post", "parent_id")
      VALUES ($1, $2, $3)
      RETURNING*
    `,
        [title, access, parentID]
      );
    if (result.rows.length === 0) throw new Error();
  }
  /* Удаление топиков */
  async deleteTopicAndAllChildren(topicID, parentID) {
    let result;
    if (!parentID)
      result = await db.query(
        `
    WITH RECURSIVE temp1 ( "id","parent_id","title") 
    AS (SELECT T1."id",T1."parent_id", T1."title"
        FROM topic T1 WHERE parent_id is NULL AND id = $1
    union
    select T2."id", T2."parent_id", T2."title"
        FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
        
    DELETE FROM topic USING temp1
	  WHERE topic.id = temp1.id
    RETURNING*
    
    `,
        [topicID]
      );
    else
      result = await db.query(
        `
    WITH RECURSIVE temp1 ( "id","parent_id","title") 
    AS (SELECT T1."id",T1."parent_id", T1."title"
        FROM topic T1 WHERE parent_id = $2 AND id = $1
    union
    select T2."id", T2."parent_id", T2."title"
        FROM topic T2 INNER JOIN temp1 ON( temp1."id"= T2."parent_id"))
        
    DELETE FROM topic USING temp1
	  WHERE topic.id = temp1.id
    RETURNING*
    
    `,
        [topicID, parentID]
      );

    if (result.rows.length === 0) throw new Error();
  }

  async getParentInfo(topicID) {
    const parents = await db.query(
      `
    WITH RECURSIVE
    temp1 (id, parent_id, path_id, path_title, LEVEL) 
    AS (SELECT T1.id, T1.parent_id,
        cast (array[T1."id"] as integer[]),
		cast (array[T1."title"] as varchar[]),
		1
    FROM topic T1
		WHERE T1.id = $1	
    union
    select T2.id, T2.parent_id,
        cast(temp1.path_id || T2."id" as integer[]),
		cast (temp1.path_title || T2."title" as varchar[]),
		LEVEL + 1
        FROM topic T2 INNER JOIN temp1 ON ( temp1."parent_id"= T2."id"))
		
    SELECT * 
    FROM temp1 
    WHERE id IS NOT NULL
    ORDER BY LEVEL 
    DESC LIMIT 1
    `,
      [topicID]
    );
    return parents.rows;
  }
}

class TopicRepo {
  constructor(repo) {
    this.repo = repo;
  }
  /* Отображение топиков */
  async #getParentTopic(parentID) {
    if (parentID === "null") return null;
    const parentTopic = await this.repo.getTopicByID(parentID);
    if (parentTopic.length === 0) throw new Error();
    return {
      id: parentTopic[0].id,
      title: parentTopic[0].title,
      accessPost: parentTopic[0].access_post,
    };
  }
  async getChildren(parentID) {
    const allTopics = await this.repo.getTopicsByParentID(parentID);
    const getChildTopics = await this.repo.getChildren(parentID);
    const parentInfo = await this.#getParentTopic(parentID);

    const topics = [];

    for (let topicItem of allTopics) {
      const id = topicItem.id;
      const childInfo = getChildTopics.filter(
        (item) => item.main_parent === id
      );

      const comments = childInfo
        .filter((item) => item.date !== null)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

      const subTitleList = [];

      for (let value of childInfo) {
        if (value.parent_id == id)
          subTitleList.push({ id: value.id, title: value.title });
      }
      const countComment = comments.length;

      let lastComment =
        countComment === 0
          ? null
          : {
              userID: comments[0].user_id,
              avatar: comments[0].avatar,
              nickName: comments[0].nick_name,
              postTitle: comments[0].post_title,
              postID: comments[0].post_id,
              date: comments[0].date,
            };

      const topic = {
        id,
        title: topicItem.title,
        accessPost: topicItem.access_post,
        subTitleList,
        countComment,
        lastComment,
      };
      topics.push(topic);
    }

    return { topics, parentInfo };
  }
  async getAllChildren(topicID) {
    const topicInfo = await this.getTopicByID(topicID);
    const childrenInfo = await this.repo.getAllChildren(topicID);
    if (topicInfo.length === 0) return { topic: null, children: [] };

    const parentTitle = topicInfo[0].parent_title
      ? topicInfo[0].parent_title
      : "Главная страница";
    const topic = {
      id: topicInfo[0].id,
      title: topicInfo[0].title,
      access: topicInfo[0].access_post,
      parentID: topicInfo[0].parent_id,
      parentTitle,
    };
    const children = [];
    for (const child of childrenInfo) {
      children.push(child.id);
    }
    children.push(topic.id);

    return { topic, children };
  }
  async getAll(userRole) {
    const topics = await this.repo.getAll();
    if (topics.length === 0) return [];
    return this.#recursiveCreateArray(topics, 1, userRole);
  }
  #recursiveCreateArray(topics, level, userRole, parentID = null) {
    const newArray = [];
    const filteredTopics = topics.filter((item) => item.level >= level);
    for (const topic of filteredTopics) {
      if (parentID !== topic.parent_id) continue;
      const newTopic = {
        id: topic.id,
        title: topic.title,
        access:
          userRole === "admin" || userRole == "moder"
            ? true
            : topic.access_post,
        children: [
          ...this.#recursiveCreateArray(
            filteredTopics,
            level + 1,
            userRole,
            topic.id
          ),
        ],
      };
      newArray.push(newTopic);
    }
    return newArray;
  }
  /* Обновление топиков */
  async getTopicByID(topicID) {
    const topic = await this.repo.getTopicByID(topicID);
    return topic;
  }
  async updateTopic(topicID, title, access, parentID) {
    await this.repo.updateTopic(topicID, title, access, parentID);
  }
  async updateTopicAccess(topicID, value) {
    await this.repo.updateTopicAccess(topicID, value);
  }
  /* Создание постов */
  async createTopic(title, access, parentID) {
    await this.repo.createTopic(title, access, parentID);
  }
  /* Удаление топиков*/
  async deleteTopic(topicID, parentID) {
    await this.repo.deleteTopicAndAllChildren(topicID, parentID);
  }

  async getParentInfo(topicID) {
    const parents = await this.repo.getParentInfo(topicID);
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
}

export default new TopicRepo(new TopicPostgressRepo());
