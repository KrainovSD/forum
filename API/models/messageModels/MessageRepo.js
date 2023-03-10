import db from "../../db.js";

class MessagePostgressRepo {
  async getLastMessagesByUserID(userID) {
    const lastMessagesInfo = await db.query(
      `
      WITH
      temp1 ("session_id", "other_members") as (
        SELECT id, array_remove(members, $1)
        FROM session_message
        WHERE $1 = ANY(members) AND (NOT ($1 = ANY(closed)) OR closed IS NULL)
      ),
      temp2 ("session_id", "other_members", "last_date", "count_message") as (
        SELECT t1.session_id, t1.other_members, max(t2.date), count(t2.id)
        FROM temp1 as t1
        LEFT JOIN message as t2 ON t2.session_id = t1.session_id
        GROUP BY t1.session_id, t1.other_members)
      SELECT t1.*, t2.body, t2.from as author_id, t3.avatar as author_avatar, t3.nick as author_nick_name
      FROM temp2 as t1
      LEFT JOIN message as t2 ON t2.date = t1.last_date AND t2.session_id = t1.session_id
      LEFT JOIN person as t3 ON t3.id = t2.from 
      ORDER BY t1.last_date DESC
      `,
      [userID]
    );
    return lastMessagesInfo.rows;
  }
  async getSessionInfoByUserID(userID) {
    const sessionsInfo = await db.query(
      `
      WITH
      temp1 ("session_id", "other_members") as (
        SELECT id, array_remove(members, $1)
        FROM session_message
        WHERE $1 = ANY(members) AND (NOT ($1 = ANY(closed)) OR closed IS NULL)
      ),
      temp2 ("session_id", "other_members", "other_nick_name") as (
        SELECT t1.session_id, t1.other_members, t2.nick
        FROM temp1 as t1
        LEFT JOIN person as t2 ON t2.id = ANY(other_members)
      )
      SELECT * FROM temp2
    `,
      [userID]
    );
    return sessionsInfo.rows;
  }

  async isHasSession(sessionID, userID) {
    const messagesInfo = await db.query(
      `
    select * from session_message 
    WHERE 
      id = $1
      AND 
      $2 = ANY(members) 
      AND 
      (NOT ($2 = ANY(closed)) OR closed IS NULL)
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
        session_id = $1
        AND
        (NOT ($2 = ANY(t1.deleted)) OR deleted IS NULL)
      ORDER BY t1.date DESC
    `,
      [sessionID, userID]
    );
    return messagesInfo.rows;
  }
}
class MessageRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getLastMessages(userID) {
    const lastMessagesInfo = await this.repo.getLastMessagesByUserID(userID);
    const sessionsInfo = await this.repo.getSessionInfoByUserID(userID);
    const messages = [];
    if (lastMessagesInfo.length === 0) return messages;

    const groupSessionInfo = {};
    for (const sessionInfo of sessionsInfo) {
      const index = sessionInfo.session_id;
      if (!groupSessionInfo?.[index]) groupSessionInfo[index] = [];
      groupSessionInfo[index].push(sessionInfo.other_nick_name);
    }

    for (const lastMessageInfo of lastMessagesInfo) {
      const message = {
        sessionID: lastMessageInfo.session_id,
        lastDate: lastMessageInfo.last_date,
        countMessage: lastMessageInfo.count_message,
        body: lastMessageInfo.body,
        lastMessage: {
          authorID: lastMessageInfo.author_id,
          authorAvatar: lastMessageInfo.author_avatar,
          authorNickName: lastMessageInfo.author_nick_name,
        },
        otherUsersNickName: groupSessionInfo[lastMessageInfo.session_id],
      };
      messages.push(message);
    }
    return messages;

    /*  
    select * from session_message WHERE 1 = ANY (members)
    UPDATE session_message SET members = array_append(members, 4) WHERE id = 1
    select * from session_message WHERE members = ARRAY[1,3]
    update session_message set members = array_remove(members, 4) WHERE id = 1
    */
  }
  async isHasSession(sessionID, userID) {
    const session = await this.repo.isHasSession(sessionID, userID);
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
}

export default new MessageRepo(new MessagePostgressRepo());
