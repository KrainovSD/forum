import db from "../../db.js";
import { COUNT_USER_CONTENT_PER_PAGE } from "../../const.js";

class UserPosgressRepo {
  /* Получение информации о пользователе */
  async getUserByID(id) {
    const user = await db.query(
      `
    WITH 
    temp1 ("id", "nick_name", "role", "avatar", "back_img", "date_registration", "last_login", "user_name", 
         "email", "reset_password_last", "confirm_email_last", "count_comment")
         as (
         SELECT t1.id, t1.nick, t1.role, t1.avatar, t1.back_img, t1.date_registration, t1.last_login, 
           t1.name, t1.email, t1.reset_password_last, t1.confirm_email_last, count(t2.id)
           FROM person as t1
           LEFT JOIN comment as t2 ON  t2.person_id = t1.id AND t2.verified = true
           WHERE t1.id = $1
           GROUP BY t1.id  
         ),
    temp2 ("comment_id", "person_id", "verified", "like_id", "like_from") as (
    SELECT t1.id, t1.person_id, t1.verified, t2.id, t2.from
      FROM comment as t1
      LEFT JOIN likes as t2 ON t1.id = t2.comment_id
      WHERE t1.person_id = $1 AND t1.verified = true
    ),
    temp3 ("id", "reputation") as (
      SELECT t1.id, count(t2.like_id)
      FROM person as t1
      LEFT JOIN temp2 as t2 ON t1.id = t2.person_id
      WHERE t1.id = $1
      GROUP BY t1.id
    )
    SELECT t1.*, t2.reputation 
      FROM temp1 as t1
      LEFT JOIN temp3 as t2 ON t1.id = t2.id
    `,
      [id]
    );
    return user.rows;
  }
  async getUserLastContent(id) {
    const lastContent = await db.query(
      `
    SELECT t1.id as comment_id, t1.body as comment_body, t1.main as comment_main,
    t1.date as comment_date, t1.updated as comment_updated, t1.date_update as comment_date_update,
    t1.person_id_updated as comment_author_update_id, t2.nick as comment_author_update_nick_name,
    t3.id as post_id, t3.title as post_title, t4.id as topic_id, t4.title as topic_title
    FROM comment as t1
    LEFT JOIN person as t2 ON t1.person_id_updated = t2.id
    LEFT JOIN post as t3 ON t1.post_id = t3.id
    LEFT JOIN topic as t4 ON t3.topic_id = t4.id
    WHERE t1.person_id = $1
    ORDER BY t1.date DESC
    LIMIT 10
  `,
      [id]
    );
    return lastContent.rows;
  }
  async getAll(userID) {
    const users = await db.query(`SELECT * FROM person WHERE NOT id = $1`, [
      userID,
    ]);
    return users.rows;
  }
  /* Вспомогательные */
  async getUserInfo(id) {
    const userInfo = await db.query("SELECT * FROM person WHERE id = $1", [id]);
    return userInfo.rows;
  }
  async getUserInfoByPasswordKey(key) {
    const userInfo = await db.query(
      "SELECT * FROM person WHERE reset_password_key = $1",
      [key]
    );
    return userInfo.rows;
  }
  async getUserInfoByEmail(email) {
    const userInfo = await db.query("SELECT * FROM person WHERE email = $1", [
      email,
    ]);
    return userInfo.rows;
  }

  /* Обновление данных */
  async switchRoleToUser(userID) {
    const result = await db.query(
      `
    UPDATE person
    SET role = 'user'
    WHERE id = $1
    RETURNING*
    `,
      [userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateNickName(nickName, userID) {
    const result = await db.query(
      `
    UPDATE person
    SET nick = $1
    WHERE id = $2
    RETURNING*
    `,
      [nickName, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateUserName(userName, userID) {
    const result = await db.query(
      `
    UPDATE person
    SET name = $1
    WHERE id = $2
    RETURNING*
    `,
      [userName, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }

  /* Смена входных данных */
  async updatePasswordNote(userID, changeKey) {
    const time = new Date();
    time.setMinutes(time.getMinutes() + 5);
    const result = await db.query(
      `
    UPDATE person
    SET reset_password_key = $2, reset_password_time = $3
    WHERE id = $1
    RETURNING*
    `,
      [userID, changeKey, time]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateEmailNote(userID, changeKey) {
    const time = new Date();
    time.setMinutes(time.getMinutes() + 5);
    const result = await db.query(
      `
    UPDATE person
    SET confirm_email_key = $2, confirm_email_time = $3, email_to_confirm = $4
    WHERE id = $1
    RETURNING*
    `,
      [userID, changeKey, time, ""]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updatePassword(password, userID) {
    const now = new Date();
    const time = new Date();
    time.setFullYear(time.getFullYear() - 10);
    const result = await db.query(
      `
     UPDATE person 
     SET hash = $1, reset_password_last = $2, reset_password_key = $3, reset_password_time = $4
     WHERE id = $5
     RETURNING*
    `,
      [password, now, "", time, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateEmail(email, key, userID) {
    const time = new Date();
    time.setMinutes(time.getMinutes() + 5);
    const result = await db.query(
      `
     UPDATE person 
     SET email_to_confirm = $1, confirm_email_key = $2, confirm_email_time = $3
     WHERE id = $4
     RETURNING*
    `,
      [email, key, time, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Смена изображений */
  async updateAvatar(nameImg, userID) {
    const result = await db.query(
      `
    UPDATE person
    SET avatar = $1
    WHERE id = $2
    RETURNING*
    `,
      [nameImg, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async updateBackImg(nameImg, userID) {
    const result = await db.query(
      `
    UPDATE person
    SET back_img = $1
    WHERE id = $2
    RETURNING*
    `,
      [nameImg, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async deleteAvatar(userID) {
    const result = await db.query(
      `UPDATE person SET avatar = '' WHERE id = $1 RETURNING*`,
      [userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  async deleteBackImg(userID) {
    const result = await db.query(
      `UPDATE person SET back_img = '' WHERE id = $1 RETURNING*`,
      [userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
}
class UserRepo {
  constructor(repo) {
    this.repo = repo;
  }
  /* Получение информации о пользователе */
  async getUserByID(id) {
    let user = await this.repo.getUserByID(id);
    if (user.length !== 1) return { userInfo: null, privateUserInfo: null };
    user = user[0];

    const userInfo = {
      id: user.id,
      nickName: user.nick_name,
      role: user.role,
      avatar: user.avatar,
      backImg: user.back_img,
      dateRegistration: user.date_registration,
      lastLogin: user.last_login,
      countComment: user.count_comment,
      reputation: user.reputation,
    };
    const privateUserInfo = {
      id: user.id,
      nickName: user.nick_name,
      role: user.role,
      avatar: user.avatar,
      backImg: user.back_img,
      dateRegistration: user.date_registration,
      lastLogin: user.last_login,
      userName: user.user_name,
      email: user.email,
      resetPasswordLast: user.reset_password_last,
      confirmEmailLast: user.confirm_email_last,
      countComment: user.count_comment,
      reputation: user.reputation,
    };

    return { userInfo, privateUserInfo };
  }
  async getUserContent(userID) {
    const lastContents = await this.repo.getUserLastContent(userID);

    const content = [];
    for (const userContentInfo of lastContents) {
      const contentItem = {
        post: {
          id: userContentInfo.post_id,
          title: userContentInfo.post_title,
        },
        topic: {
          id: userContentInfo.topic_id,
          title: userContentInfo.topic_title,
        },
        comment: {
          id: userContentInfo.comment_id,
          body: userContentInfo.comment_body,
          main: userContentInfo.comment_main,
          date: userContentInfo.comment_date,
          update: {
            updated: userContentInfo.comment_updated,
            authorID: userContentInfo.comment_author_update_id,
            authorNickName: userContentInfo.comment_author_update_nick_name,
            date: userContentInfo.comment_date_update,
          },
        },
      };
      content.push(contentItem);
    }
    return content;
  }
  async getAll(userID) {
    const usersInfo = await this.repo.getAll(userID);
    const users = [];
    for (const userInfo of usersInfo) {
      const user = {
        id: userInfo.id,
        avatar: userInfo.avatar,
        nickName: userInfo.nick,
      };
      users.push(user);
    }

    return users;
  }

  /* Обновление данных */
  async switchRoleToUser(userID) {
    await this.repo.switchRoleToUser(userID);
  }
  async updateNickName(nickName, userID) {
    await this.repo.updateNickName(nickName, userID);
  }
  async updateUserName(userName, userID) {
    await this.repo.updateUserName(userName, userID);
  }
  /* Вспомогательные  */
  async getUserInfo(userID) {
    const userInfo = await this.repo.getUserInfo(userID);
    return userInfo;
  }
  async getUserInfoByPasswordKey(key) {
    const userInfo = await this.repo.getUserInfoByPasswordKey(key);
    return userInfo;
  }
  async getUserInfoByEmail(email) {
    const userInfo = await this.repo.getUserInfoByEmail(email);
    return userInfo;
  }

  /* Смена входных данных */
  async updatePasswordNote(userID, changeKey) {
    await this.repo.updatePasswordNote(userID, changeKey);
  }
  async updateEmailNote(userID, changeKey) {
    await this.repo.updateEmailNote(userID, changeKey);
  }
  async updatePassword(password, userID) {
    await this.repo.updatePassword(password, userID);
  }
  async updateEmail(email, key, userID) {
    await this.repo.updateEmail(email, key, userID);
  }
  /* Смена изображений */
  async updateAvatar(nameImg, userID) {
    await this.repo.updateAvatar(nameImg, userID);
  }
  async updateBackImg(nameImg, userID) {
    await this.repo.updateBackImg(nameImg, userID);
  }
  async deleteAvatar(userID) {
    await this.repo.deleteAvatar(userID);
  }
  async deleteBackImg(userID) {
    await this.repo.deleteBackImg(userID);
  }
}

export default new UserRepo(new UserPosgressRepo());
