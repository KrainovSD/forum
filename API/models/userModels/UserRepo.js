import db from "../../db.js";

class UserPosgressRepo {
  async getUserByID(id) {
    let user = await db.query(
      `
    WITH 
    temp1 ("id", "nick_name", "role", "avatar", "back_img", "date_registration", "last_login", "user_name", 
         "email", "reset_password_last", "confirm_email_last", "count_comment")
         as (
         SELECT t1.id, t1.nick, t1.role, t1.avatar, t1.back_img, t1.date_registration, t1.last_login, 
           t1.name, t1.email, t1.reset_password_last, t1.confirm_email_last, count(t2.id)
           FROM person as t1
           LEFT JOIN comment as t2 ON  t2.person_id = t1.id
           WHERE t1.id = $1
           GROUP BY t1.id  
         ),
    temp2 ("id", "reputation") as (
      SELECT t1.id, count(t2.id)
      FROM person as t1
      LEFT JOIN likes as t2 ON t1.id = t2.to
      WHERE t1.id = $1
      GROUP BY t1.id
    )
    SELECT t1.*, t2.reputation 
      FROM temp1 as t1
      LEFT JOIN temp2 as t2 ON t1.id = t2.id
    `,
      [id]
    );

    if (user.rows.length !== 1)
      return { userInfo: null, privateUserInfo: null };

    user = user.rows[0];

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
}
class UserRepo {
  constructor(repo) {
    this.repo = repo;
  }
  async getUserByID(id) {
    return this.repo.getUserByID(id);
  }
}

export default new UserRepo(new UserPosgressRepo());
