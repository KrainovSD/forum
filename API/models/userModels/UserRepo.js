import db from "../../db.js";
const COUNT_CONTENT_ITEM_PER_PAGE = 3;

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
    return user.rows;
  }
  async getUserInfo(id) {
    const userInfo = await db.query("SELECT * FROM person WHERE id = $1", [id]);
    return userInfo.rows;
  }
  /* Получение информации о контенте пользователя */
  async getAllPostByUserID(userID) {
    const allPosts = await db.query(
      `
    SELECT * FROM post WHERE person_id = $1
    `,
      [userID]
    );
    return allPosts.rows;
  }
  async getAllCommentByUserID(userID) {
    const allComments = await db.query(
      `
    SELECT * FROM comment WHERE person_id = $1
    `,
      [userID]
    );
    return allComments.rows;
  }
  async getUserComments(userID, offset) {
    const userComments = await db.query(
      `
    SELECT t1.id, t1.body, t1.date, t1.updated, t1.date_update, t2.id as author_update_id, t2.nick as author_update_nick_name, 
    t3.id as post_id, t3.title as post_title, t4.id as topic_id, t4.title as topic_title
    FROM comment as t1
    LEFT JOIN person as t2 ON t2.id = t1.person_id_updated
    LEFT JOIN post as t3 ON t3.id = t1.post_id
    LEFT JOIN topic as t4 ON t4.id = t3.topic_id
    WHERE t1.person_id = $1
    ORDER BY t1.date DESC
    LIMIT $2 OFFSET $3
    `,
      [userID, COUNT_CONTENT_ITEM_PER_PAGE, offset]
    );
    return userComments.rows;
  }
  async getUserPosts(userID, offset, filter) {
    const filterQuery = this.#getSortedPostQuery(filter);
    const userPosts = await db.query(
      `
    WITH 
    temp1 ("id", "count_view") as (
    SELECT t1.id, count(t2.id)
      FROM post as t1
      LEFT JOIN viewed_post as t2 ON t2.post_id = t1.id
      WHERE t1.person_id = $1
      GROUP BY t1.id
    ),
    temp2 ("id", "count_comment", "last_comment_date") as (
    SELECT t1.id, count(t2.id),  max(t2.date)
      FROM post as t1
      LEFT JOIN comment as t2 ON t2.post_id = t1.id
      WHERE t1.person_id = $1
      GROUP BY t1.id
    ),
    temp3 ("id", "count_comment", "last_comment_date", "last_comment_id", "last_comment_author_id", 
        "last_comment_author_nick_name", "last_comment_author_avatar") as (
      SELECT t1.id, t1.count_comment, t1.last_comment_date, t2.id, t3.id, t3.nick, t3.avatar
          FROM temp2 as t1
          LEFT JOIN comment as t2 ON t2.post_id = t1.id AND t2.date = t1.last_comment_date
          LEFT JOIN person as t3 ON t2.person_id = t3.id
        )
    SELECT t1.id as "post_id", t1.title, t1.date, t2.count_view, t3.id as author_post_id, 
    t3.avatar as author_post_avatar, t3.nick as author_post_nick_name, t5.id as topic_id, t5.title as topic_title, 
    t4.count_comment, t4.last_comment_date, t4.last_comment_id, t4.last_comment_author_id, 
    t4.last_comment_author_nick_name, t4.last_comment_author_avatar
    FROM post as t1
    RIGHT JOIN temp1 as t2 ON t2.id = t1.id
    LEFT JOIN person as t3 ON t3.id = t1.person_id
    LEFT JOIN temp3 as t4 ON t4.id = t1.id
    LEFT JOIN topic as t5 ON t5.id = t1.topic_id
    ORDER BY ${filterQuery}
    LIMIT $2 OFFSET $3
    `,
      [userID, COUNT_CONTENT_ITEM_PER_PAGE, offset]
    );
    return userPosts.rows;
  }
  #getSortedPostQuery(filter) {
    let filterString;
    switch (filter) {
      case "last-update": {
        return (filterString =
          "t4.last_comment_date DESC NULLS LAST, t1.date DESC");
      }
      case "title": {
        return (filterString = "t1.title, t1.date DESC");
      }
      case "last-date-create": {
        return (filterString = "t1.date DESC");
      }
      case "most-view": {
        return (filterString = "t2.count_view DESC, t1.date DESC");
      }
      case "most-comment": {
        return (filterString = "t4.count_comment DESC, t1.date DESC");
      }
      default: {
        return (filterString = "t1.date DESC");
      }
    }
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
  /* Получение информации о контенте пользователя */
  async getUserComments(userID, page) {
    page = page ? page : 1;
    const offset = (page - 1) * COUNT_CONTENT_ITEM_PER_PAGE;
    const allPost = await this.repo.getAllCommentByUserID(userID);
    const maxPage = Math.ceil(allPost.length / COUNT_CONTENT_ITEM_PER_PAGE);
    if (maxPage === 0 || page > maxPage) return { maxPage, userComments: [] };

    const userCommentsInfo = await this.repo.getUserComments(userID, offset);
    const userComments = [];
    for (const userCommentInfo of userCommentsInfo) {
      const userComment = {
        id: userCommentInfo.id,
        body: userCommentInfo.body,
        date: userCommentInfo.date,
        updatedInfo: {
          update: userCommentInfo.updated,
          authorID: userCommentInfo.author_update_id,
          authorNickName: userCommentInfo.author_update_nick_name,
          date: userCommentInfo.date_update,
        },
        postInfo: {
          id: userCommentInfo.post_id,
          title: userCommentInfo.post_title,
        },
        topicInfo: {
          id: userCommentInfo.topic_id,
          title: userCommentInfo.topic_title,
        },
      };
      userComments.push(userComment);
    }
    return { maxPage, userComments };
  }
  async getUserPosts(userID, page, filter) {
    page = page ? page : 1;
    const offset = (page - 1) * COUNT_CONTENT_ITEM_PER_PAGE;
    const allPost = await this.repo.getAllPostByUserID(userID);
    const maxPage = Math.ceil(allPost.length / COUNT_CONTENT_ITEM_PER_PAGE);

    if (maxPage === 0 || page > maxPage) return { maxPage, userPosts: [] };

    const userPostsInfo = await this.repo.getUserPosts(userID, offset, filter);
    const userPosts = [];
    for (const userPostInfo of userPostsInfo) {
      const userPost = {
        postID: userPostInfo.post_id,
        postTitle: userPostInfo.title,
        postDate: userPostInfo.date,
        topicID: userPostInfo.topic_id,
        topicTitle: userPostInfo.topic_title,
        authorPost: {
          id: userPostInfo.author_post_id,
          avatar: userPostInfo.author_post_avatar,
          nickName: userPostInfo.author_post_nick_name,
        },
        countView: userPostInfo.count_view,
        countComment: userPostInfo.count_comment,
        lastMessage: {
          id: userPostInfo.last_comment_id,
          date: userPostInfo.last_comment_date,
          author: {
            id: userPostInfo.last_comment_author_id,
            nickName: userPostInfo.last_comment_author_nick_name,
            avatar: userPostInfo.last_comment_author_avatar,
          },
        },
      };
      userPosts.push(userPost);
    }
    return { userPosts, maxPage };
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
  /* Смена входных данных */
  async getUserInfo(userID) {
    const userInfo = await this.repo.getUserInfo(userID);
    return userInfo;
  }
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
}

export default new UserRepo(new UserPosgressRepo());
