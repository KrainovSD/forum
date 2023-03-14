import db from "../../db.js";

class MessagePostgressRepo {
  /* Информация о сессии и последних сообщениях в них */
  async getSessionInfoByUserID(userID) {
    const sessionsInfo = await db.query(
      `
      WITH
      temp1 ("session_id") as (
        SELECT t1.id 
        FROM session_message as t1
        LEFT JOIN session_members as t2 ON t2.session_id = t1.id
        WHERE t2.member = $1 AND t2.closed = false
	  ),
      temp2 ("session_id", "last_date", "count_message") as (
        SELECT t1.session_id,  max(t2.date), count(t2.id)
        FROM temp1 as t1
        LEFT JOIN message as t2 ON t2.session_id = t1.session_id
        GROUP BY t1.session_id),
	  temp3 ("session_id", "member") as (
        SELECT t1.session_id, t2.member
        FROM temp1 as t1
        LEFT JOIN session_members as t2 ON t2.session_id = t1.session_id
        WHERE NOT t2.member = $1
      ),
      temp4 ("session_id", "member", "other_nick_name") as (
        SELECT t1.session_id, t1.member, t2.nick
        FROM temp3 as t1
        LEFT JOIN person as t2 ON t2.id = t1.member
      ),
	  temp5 ("session_id", "other_members_nick_name", "other_members_id") as (
      SELECT session_id, array_agg(other_nick_name), array_agg(member)
	  FROM temp4
	  GROUP BY session_id
	  ),
	  temp6("session_id", "last_date", "count_message", "other_members_nick_name", 
			"other_members_id") as (
	  SELECT t1.session_id, t1.last_date, t1.count_message, t2.other_members_nick_name, 
				t2.other_members_id
	  FROM temp2 as t1
	  LEFT JOIN temp5 as t2 ON t2.session_id = t1.session_id
	  )
      SELECT t1.*, t2.id as last_id, t2.body, t2.from as author_id, t3.avatar as author_avatar, t3.nick as author_nick_name
      FROM temp6 as t1
      LEFT JOIN message as t2 ON t2.date = t1.last_date AND t2.session_id = t1.session_id
      LEFT JOIN person as t3 ON t3.id = t2.from 
      ORDER BY t1.last_date DESC
    `,
      [userID]
    );
    return sessionsInfo.rows;
  }
  /* Информация о сообщениях в выбранной сесии */
  async isHasActiveSession(sessionID, userID) {
    const messagesInfo = await db.query(
      `
      SELECT t1.id, t2.member, t2.closed
      FROM session_message as t1
      LEFT JOIN session_members as t2 ON t2.session_id = t1.id
      WHERE t1.id = $1 AND t2.member = $2 AND t2.closed = false
    `,
      [sessionID, userID]
    );
    return messagesInfo.rows;
  }
  async getMessagesBySessionID(sessionID, userID) {
    const messagesInfo = await db.query(
      `
      SELECT t1.*, t2.avatar as from_avatar, t2.nick as from_nick_name
      FROM message as t1
      LEFT JOIN person as t2 ON t2.id = t1.from
      WHERE
        t1.session_id = $1
        AND
        (NOT ($2 = ANY(t1.deleted)) OR t1.deleted IS NULL)
      ORDER BY t1.date DESC
    `,
      [sessionID, userID]
    );
    return messagesInfo.rows;
  }
  /* Создание сообщения */
  async getSessionByMembers(members) {
    const array = `ARRAY[${members.join(",")}]`;
    const session = await db.query(
      `
      WITH
      temp1 ("session_id", "members") as (
        SELECT session_id, array_agg(member)
        FROM session_members
        GROUP BY session_id
      )
      SELECT * 
    FROM temp1
    WHERE (members <@ ${array}) AND (members @> ${array})
    `
    );
    return session.rows;
  }
  async createSession() {
    const result = await db.query(`
    INSERT INTO session_message ("id") VALUES (default) RETURNING*
    `);
    return result.rows;
  }
  async createMembers(members, sessionID) {
    const values = [];
    for (const member of members) {
      const value = `(${member}, false, ${sessionID})`;
      values.push(value);
    }

    const result = await db.query(`
    INSERT INTO session_members ("member", "closed", "session_id")
    VALUES ${values.join(",")}
    RETURNING*
    `);
    if (result.rows.length !== members.length) throw new Error();
  }
  async createMessage(body, userID, sessionID) {
    const date = new Date();
    const result = await db.query(
      `
      INSERT INTO message ("body", "from", "date", "session_id")
      VALUES ($1, $2, $3, $4) 
      RETURNING*
    `,
      [body, userID, date, sessionID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async openSessionByMembers(members, sessionID) {
    const result = await db.query(
      `
    UPDATE session_members
    SET closed = false
    WHERE session_id = $1 AND member = ANY($2)
    RETURNING*
    `,
      [sessionID, members]
    );
    console.log(result.rows);
  }
  /* Удаление сообщения у пользователя */
  async getMessageByIDAndUserID(messageID, userID) {
    const result = await db.query(
      `
    WITH
    temp1 ("session_id") as (
      SELECT session_id 
      FROM message
      WHERE 
        id = $1
            AND
            (NOT ($2 = ANY(deleted)) OR deleted IS NULL)
    )
    SELECT t1.*, t2.member
    FROM temp1 as t1
    LEFT JOIN session_members as t2 ON t2.session_id = t1.session_id
    WHERE t2.member = $2
    `,
      [messageID, userID]
    );
    return result.rows;
  }
  async deleteMessage(messageID, userID) {
    const result = await db.query(
      `
    UPDATE message 
    SET deleted = array_append(deleted, $2)
    WHERE id = $1 RETURNING*
    `,
      [messageID, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Закрытие сессии у пользователя */
  async getSessionBySessionAndUserID(sessionID, userID) {
    const result = await db.query(
      `
      SELECT * FROM session_members
      WHERE session_id = $1 AND member = $2 AND closed = false
    `,
      [sessionID, userID]
    );
    return result.rows;
  }
  async closeSession(sessionID, userID) {
    const result = await db.query(
      `
      UPDATE session_members 
      SET closed = true
      WHERE session_id = $1 AND member = $2
      RETURNING*
    `,
      [sessionID, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async deleteAllMessageBySession(sessionID, userID) {
    const result = await db.query(
      `
      UPDATE message
      SET deleted = array_append(deleted, $2)
      WHERE session_id = $1 AND (NOT ($2 = ANY(deleted)) OR deleted IS NULL)
      RETURNING*
    `,
      [sessionID, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Редактирование сообщения  */
  async getMessageByID(messageID) {
    const message = await db.query(`SELECT * FROM message WHERE id = $1`, [
      messageID,
    ]);
    return message.rows;
  }
  async updateMessage(messageID, body) {
    const result = await db.query(
      `
    UPDATE message
    SET body = $2
    WHERE id = $1
    RETURNING*
    `,
      [messageID, body]
    );
    if (result.rows.length === 0) throw new Error();
  }
}
/*  
    select * from session_message WHERE 1 = ANY (members)
    UPDATE session_message SET members = array_append(members, 4) WHERE id = 1
    select * from session_message WHERE members = ARRAY[1,3]
    update session_message set members = array_remove(members, 4) WHERE id = 1
    */

class MessageRepo {
  constructor(repo) {
    this.repo = repo;
  }
  /* Информация о сессии и последних сообщениях в них */
  async getSessionInfo(userID) {
    const sessionsInfo = await this.repo.getSessionInfoByUserID(userID);
    const messages = [];
    if (sessionsInfo.length === 0) return messages;

    for (const sessionInfo of sessionsInfo) {
      const message = {
        sessionID: sessionInfo.session_id,
        otherUsersNickName: sessionInfo.other_members_nick_name,
        otherUsersID: sessionInfo.other_members_id,
        countMessage: sessionInfo.count_message,
        lastMessage: {
          authorID: sessionInfo.author_id,
          authorAvatar: sessionInfo.author_avatar,
          authorNickName: sessionInfo.author_nick_name,
          lastDate: sessionInfo.last_date,
          body: sessionInfo.body,
        },
      };
      messages.push(message);
    }
    return messages;
  }
  /* Информация о сообщениях в выбранной сесии */
  async isHasActiveSession(sessionID, userID) {
    const session = await this.repo.isHasActiveSession(sessionID, userID);
    if (session.length === 0) return false;
    return true;
  }
  async getBySessionID(sessionID, userID) {
    const messagesInfo = await this.repo.getMessagesBySessionID(
      sessionID,
      userID
    );
    const messages = [];
    for (const messageInfo of messagesInfo) {
      const message = {
        id: messageInfo.id,
        body: messageInfo.body,
        fromID: messageInfo.from,
        fromAvatar: messageInfo.from_avatar,
        fromNickName: messageInfo.from_nick_name,
        date: messageInfo.date,
      };
      messages.push(message);
    }

    return messages;
  }
  /* Создание сообщения */
  async findSessionIDByMembers(members) {
    const sessionID = await this.repo.getSessionByMembers(members);
    if (sessionID.length > 1) throw new Error();
    if (sessionID.length === 1) return sessionID[0].session_id;
    const newSessionID = await this.repo.createSession();
    if (newSessionID.length === 0) throw new Error();
    const id = newSessionID[0].id;
    await this.repo.createMembers(members, id);
    return id;
  }
  async createSession(userID, to) {
    const members = [...to, userID];
    await this.repo.createSession(members);
  }
  async createMessage(body, userID, sessionID) {
    await this.repo.createMessage(body, userID, sessionID);
  }
  async openSessionByMembers(members, sessionID) {
    await this.repo.openSessionByMembers(members, sessionID);
  }
  /* Удаление сообщения у пользователя */
  async isHasAccessToMessage(messageID, userID) {
    const result = await this.repo.getMessageByIDAndUserID(messageID, userID);
    if (result.length === 0) return false;
    return true;
  }
  async deleteMessage(messageID, userID) {
    await this.repo.deleteMessage(messageID, userID);
  }
  /* Закрытие сессии у пользователя */
  async isHasAccessToSession(sessionID, userID) {
    const result = await this.repo.getSessionBySessionAndUserID(
      sessionID,
      userID
    );
    if (result.length === 0) return false;
    return true;
  }
  async closeSession(sessionID, userID) {
    await this.repo.closeSession(sessionID, userID);
  }
  async deleteAllMessageBySession(sessionID, userID) {
    await this.repo.deleteAllMessageBySession(sessionID, userID);
  }
  /* Редактирование сообщения  */
  async getMessageByID(messageID) {
    const message = await this.repo.getMessageByID(messageID);
    return message;
  }
  async updateMessage(messageID, body) {
    await this.repo.updateMessage(messageID, body);
  }
}

export default new MessageRepo(new MessagePostgressRepo());
