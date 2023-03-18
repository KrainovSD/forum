import db from "../../db.js";
import bcrypt from "bcrypt";
const saltRounds = 12;

class AuthPostgressRepo {
  /* Регистрация */
  async getSimilarNickAndEmail(nickName, email) {
    const similarNickNameAndEmail = await db.query(
      "SELECT nick, email, id, confirmed FROM person WHERE nick=$1 OR email=$2",
      [nickName, email]
    );
    return similarNickNameAndEmail.rows;
  }
  async deleteInActiveUser(id) {
    const result = await db.query("DELETE FROM person WHERE id=$1 RETURNING*", [
      id,
    ]);
    if (result.rows.length === 0) throw new Error();
  }
  async createUser(userName, nickName, email, hash, confirmEmailKey) {
    const now = new Date();
    const future = new Date();
    future.setFullYear(future.getFullYear() + 10);
    const past = new Date();
    past.setFullYear(past.getFullYear() - 10);

    const result = await db.query(
      "INSERT INTO person (name, nick, email_to_confirm, hash, date_registration, confirm_email_key, reset_password_time, confirm_email_time, reset_password_last, confirm_email_last) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        userName,
        nickName,
        email,
        hash,
        now,
        confirmEmailKey,
        past,
        future,
        past,
        past,
      ]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Вход в систему */
  async getUserByNickName(nickName) {
    const user = await db.query(
      "SELECT id, nick, hash, confirmed, token, role FROM person WHERE nick=$1",
      [nickName]
    );
    return user.rows;
  }
  async saveToken(token, userID) {
    const now = new Date();
    const result = await db.query(
      "UPDATE person set token=$1, last_login=$2 WHERE id=$3 RETURNING *",
      [token, now, userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Получение токена */
  async getRefreshTokenByUserID(userID) {
    const refreshToken = await db.query(
      "SELECT token FROM person WHERE id=$1",
      [userID]
    );
    return refreshToken.rows;
  }
  /* Выход из системы */
  async removeTokenByID(userID) {
    const result = await db.query(
      "UPDATE person set token=$1 WHERE id=$2 RETURNING*",
      ["", userID]
    );
    if (result.rows.length === 0) throw new Error();
  }
  /* Активация электронной почты */
  async getUserInfoByConfirmKey(key) {
    const checkValidConfirm = await db.query(
      "SELECT confirm_email_key, confirm_email_time, confirm_email_last, email_to_confirm FROM person WHERE confirm_email_key=$1",
      [key]
    );
    return checkValidConfirm.rows;
  }
  async getEmailToConfirmByConfirmKey(key) {
    const emailToConfirm = await db.query(
      "SELECT email_to_confirm FROM person WHERE confirm_email_key=$1",
      [key]
    );
    return emailToConfirm.rows;
  }
  async switchConfirm(email, key) {
    const now = new Date();
    const future = new Date();
    future.setFullYear(future.getFullYear() - 10);

    const result = await db.query(
      "UPDATE person set confirmed=$1, confirm_email_key=$2, confirm_email_time=$3, confirm_email_last=$4, email_to_confirm=$5, email=$6 WHERE confirm_email_key=$7 RETURNING *",
      [true, "", future, now, "", email, key]
    );
    if (result.rows.length === 0) throw new Error();
  }
}

class AuthRepo {
  repo;

  constructor(repo) {
    this.repo = repo;
  }
  /* Регистрация */
  async isHasSimilarNickOrEmail(nickName, email) {
    const similarNickNameAndEmail = await this.repo.getSimilarNickAndEmail(
      nickName,
      email
    );

    if (similarNickNameAndEmail.length === 0) return { status: false };
    const firstSimilar = similarNickNameAndEmail[0];
    const secondSimilar = similarNickNameAndEmail?.[1]
      ? similarNickNameAndEmail[1]
      : null;

    if (!firstSimilar.confirmed)
      await this.repo.deleteInActiveUser(firstSimilar.id);
    else {
      if (firstSimilar.email === email && firstSimilar.nick === nickName)
        return {
          status: true,
          message: "Указанная электронная почта и никнейм уже используются!",
        };
      else if (firstSimilar.email === email)
        return {
          status: true,
          message: "Указанная электронная почта уже используется!",
        };
      else if (firstSimilar.nick === nickName)
        return {
          status: true,
          message: "Указанный никнейм уже используется!",
        };
    }

    if (secondSimilar && !secondSimilar?.confirmed)
      await this.repo.deleteInActiveUser(secondSimilar.id);
    else if (secondSimilar && secondSimilar?.confirmed) {
      if (secondSimilar.email === email)
        return {
          status: true,
          message: "Указанная электронная почта уже используется!",
        };
      else if (secondSimilar.nick === nickName)
        return {
          status: true,
          message: "Указанный никнейм уже используется!",
        };
    }

    return { status: false };
  }
  async createUser(userName, nickName, email, hash, confirmEmailKey) {
    await this.repo.createUser(
      userName,
      nickName,
      email,
      hash,
      confirmEmailKey
    );
  }
  /* Вход в систему */
  async isValidLogin(nickName, password) {
    const user = await this.repo.getUserByNickName(nickName);
    if (user?.length === 0)
      return { status: false, message: "Неверно указан никнейм или пароль!" };

    if (!user[0].confirmed)
      return { status: false, message: "Аккаунт не подтвержден!" };

    const hash = user[0].hash;
    if (!(await bcrypt.compare(password, hash)))
      return { status: false, message: "Неверно указан никнейм или пароль!" };

    return {
      status: true,
      id: user[0].id,
      token: user[0].token,
      role: user[0].role,
    };
  }
  async saveToken(token, userID) {
    await this.repo.saveToken(token, userID);
  }
  /* Получение токена */
  async findRefreshTokenByUserID(userID) {
    const refreshToken = await this.repo.getRefreshTokenByUserID(userID);
    if (!refreshToken?.[0]?.token) throw new Error();
    return refreshToken[0].token;
  }
  /* Выход из системы */
  async removeTokenByID(userID) {
    await this.repo.removeTokenByID(userID);
  }
  /* Активация электронной почты */
  async getUserInfoByConfirmKey(key) {
    const userInfo = await this.repo.getUserInfoByConfirmKey(key);
    return userInfo;
  }
  async switchConfirm(key) {
    const emailToConfirm = await this.repo.getEmailToConfirmByConfirmKey(key);
    const email = emailToConfirm?.[0]?.email_to_confirm;
    if (!email) throw new Error();

    await this.repo.switchConfirm(email, key);
  }
}

export default new AuthRepo(new AuthPostgressRepo());
