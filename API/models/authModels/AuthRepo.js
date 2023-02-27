import db from "../../db.js";
import bcrypt from "bcrypt";
const saltRounds = 12;

class AuthPostgressRepo {
  async isHasSimilarNickOrEmail(nickName, email) {
    const similarNickNameAndEmail = await db.query(
      "SELECT nick, email, id, confirmed FROM person WHERE nick=$1 OR email=$2",
      [nickName, email]
    );
    if (similarNickNameAndEmail.rows.length === 0) return { status: false };
    const firstSimilar = similarNickNameAndEmail.rows[0];
    const secondSimilar = similarNickNameAndEmail.rows?.[1]
      ? similarNickNameAndEmail.rows[1]
      : null;

    if (!firstSimilar.confirmed) await this.#deleteInActive(firstSimilar.id);
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
      await this.#deleteInActive(secondSimilar.id);
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
    const now = new Date();
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const past = new Date();
    past.setFullYear(past.getFullYear() - 1);

    const createUser = await db.query(
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
    console.log(createUser?.rows?.[0]);
  }

  async isValidLogin(nickName, password) {
    const user = await db.query(
      "SELECT id, nick, hash, confirmed, token, role FROM person WHERE nick=$1",
      [nickName]
    );
    if (user.rows?.length === 0)
      return { status: false, message: "Неверно указан никнейм или пароль!" };

    if (!user.rows[0].confirmed)
      return { status: false, message: "Аккаунт не подтвержден!" };

    const hash = user.rows[0].hash;
    if (!(await bcrypt.compare(password, hash)))
      return { status: false, message: "Неверно указан никнейм или пароль!" };

    return {
      status: true,
      id: user.rows[0].id,
      token: user.rows[0].token,
      role: user.rows[0].role,
    };
  }
  async saveLogin(token, userID) {
    const now = new Date();
    const saveToken = await db.query(
      "UPDATE person set token=$1, last_login=$2 WHERE id=$3 RETURNING *",
      [token, now, userID]
    );
    console.log(saveToken?.rows?.[0]);
  }

  async findRefreshTokenAndRoleByUserID(userID) {
    const refreshToken = await db.query(
      "SELECT token, role FROM person WHERE id=$1",
      [userID]
    );
    if (!refreshToken.rows?.[0]?.token || !refreshToken.rows?.[0]?.role)
      throw new Error();
    return {
      refreshTokenInBD: refreshToken.rows[0].token,
      role: refreshToken.rows?.[0]?.role,
    };
  }

  async removeTokenByID(userID) {
    const remove = db.query(
      "UPDATE person set token=$1 WHERE id=$2 RETURNING *",
      ["", userID]
    );
    console.log(remove?.rows);
  }

  async isValidConfirm(key) {
    const checkValidConfirm = await db.query(
      "SELECT confirm_email_key, confirm_email_time, confirm_email_last, email_to_confirm FROM person WHERE confirm_email_key=$1",
      [key]
    );
    if (checkValidConfirm.rows.length === 0)
      return { status: false, message: "Указанный ключ не существует!" };

    if (!checkValidConfirm.rows?.[0]?.confirm_email_time) throw new Error();
    const confirmTime = new Date(checkValidConfirm.rows[0].confirm_email_time);
    if (new Date() > confirmTime)
      return { status: false, message: "Время операции истекло!" };

    if (!checkValidConfirm.rows?.[0]?.confirm_email_last) throw new Error();
    const confirmLast = new Date(checkValidConfirm.rows[0].confirm_email_last);
    confirmLast.setDate(confirmLast.getDate() + 1);
    if (new Date() < confirmLast)
      return {
        status: false,
        message:
          "Интервал между сменой электронной почты должен составлять не менее 24 часов!",
      };

    if (!checkValidConfirm.rows?.[0].email_to_confirm)
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
    let email = await db.query(
      "SELECT email_to_confirm FROM person WHERE confirm_email_key=$1",
      [key]
    );
    email = email.rows?.[0]?.email_to_confirm;
    if (!email) throw new Error();

    const now = new Date();
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);

    const updateConfirm = await db.query(
      "UPDATE person set confirmed=$1, confirm_email_key=$2, confirm_email_time=$3, confirm_email_last=$4, email_to_confirm=$5, email=$6 WHERE confirm_email_key=$7 RETURNING *",
      [true, "", future, now, "", email, key]
    );
    console.log(updateConfirm?.rows?.[0]);
  }

  async #deleteInActive(id) {
    const deleteInActiveUser = await db.query(
      "DELETE FROM person WHERE id=$1 RETURNING *",
      [id]
    );
    console.log("DELETE");
    console.log(deleteInActiveUser?.rows?.[0]);
  }
}

class AuthRepo {
  repo;

  constructor(repo) {
    this.repo = repo;
  }

  async isHasSimilarNickOrEmail(nickName, email) {
    return this.repo.isHasSimilarNickOrEmail(nickName, email);
  }
  async createUser(userName, nickName, email, hash, confirmEmailKey) {
    return this.repo.createUser(
      userName,
      nickName,
      email,
      hash,
      confirmEmailKey
    );
  }

  async isValidLogin(nickName, password) {
    return this.repo.isValidLogin(nickName, password);
  }
  async saveLogin(token, userID) {
    return this.repo.saveLogin(token, userID);
  }

  async findRefreshTokenAndRoleByUserID(userID) {
    return this.repo.findRefreshTokenAndRoleByUserID(userID);
  }

  async removeTokenByID(userID) {
    return this.repo.removeTokenByID(userID);
  }

  async isValidConfirm(key) {
    return this.repo.isValidConfirm(key);
  }
  async switchConfirm(key) {
    return this.repo.switchConfirm(key);
  }
}

export default new AuthRepo(new AuthPostgressRepo());
