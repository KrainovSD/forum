import db from "../../db.js";
import bcrypt from "bcrypt";
const saltRounds = 12;

class AuthPostgressRepo {
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
    future.setFullYear(future.getFullYear() + 1);
    const past = new Date();
    past.setFullYear(past.getFullYear() - 1);

    const result = await db.query(
      "INSERT INTO person (name, nick, email_to_confirm, hash, date_registration, confirm_email_key, reset_password_time, confirm_email_time, reset_password_last, confirm_email_last) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        userName,
        nickName,
        email,
        hash,
        now,
        confirmEmailKey,
        future,
        future,
        past,
        past,
      ]
    );
    if (result.rows.length === 0) throw new Error();
  }

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

  async getRefreshTokenByUserID(userID) {
    const refreshToken = await db.query(
      "SELECT token FROM person WHERE id=$1",
      [userID]
    );
    return refreshToken.rows;
  }

  async removeTokenByID(userID) {
    const result = await db.query(
      "UPDATE person set token=$1 WHERE id=$2 RETURNING*",
      ["", userID]
    );
    if (result.rows.length === 0) throw new Error();
  }

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
    future.setFullYear(future.getFullYear() + 1);

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

    if (!firstSimilar.confirmed) await this.deleteInActiveUser(firstSimilar.id);
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
      await this.deleteInActiveUser(secondSimilar.id);
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

  async findRefreshTokenByUserID(userID) {
    const refreshToken = await this.repo.getRefreshTokenByUserID(userID);
    if (!refreshToken?.[0]?.token) throw new Error();
    return refreshToken[0].token;
  }

  async removeTokenByID(userID) {
    await this.repo.removeTokenByID(userID);
  }

  async isValidConfirm(key) {
    const userInfo = await this.repo.getUserInfoByConfirmKey(key);

    if (userInfo.length === 0)
      return { status: false, message: "Указанный ключ не существует!" };

    if (!userInfo?.[0]?.confirm_email_time) throw new Error();
    const confirmTime = new Date(userInfo[0].confirm_email_time);
    if (new Date() > confirmTime)
      return { status: false, message: "Время операции истекло!" };

    if (!userInfo?.[0]?.confirm_email_last) throw new Error();
    const confirmLast = new Date(userInfo[0].confirm_email_last);
    confirmLast.setDate(confirmLast.getDate() + 1);
    if (new Date() < confirmLast)
      return {
        status: false,
        message:
          "Интервал между сменой электронной почты должен составлять не менее 24 часов!",
      };

    if (!userInfo?.[0].email_to_confirm)
      return {
        status: false,
        message:
          "Нет записи о новой электронной почте, попробуйте повторить операцию с самого начала через некоторое время!",
      };

    return {
      status: true,
    };
  }
  async switchConfirm(key) {
    const emailToConfirm = await this.repo.getEmailToConfirmByConfirmKey(key);
    const email = emailToConfirm.rows?.[0]?.email_to_confirm;
    if (!email) throw new Error();

    await this.repo.switchConfirm(email, key);
  }
}

export default new AuthRepo(new AuthPostgressRepo());
