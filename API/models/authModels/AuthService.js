import * as dotenv from "dotenv";
dotenv.config({ path: "environment.env", silent: true });

import jwt from "jsonwebtoken";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const acessTokenLiveTime = process.env.ACCESS_TOKEN_LIVE_TIME;
const refreshTokenLiveTime = process.env.REFRESH_TOKEN_LIVE_TIME;
const PRODUCTION = process.env.PRODUCTION || false;
import bcrypt from "bcrypt";
const saltRounds = 12;

import authRepo from "./AuthRepo.js";
import { sendEmailWithLink } from "../../mailer.js";
import AuthRepo from "./AuthRepo.js";

class AuthServise {
  async register(password, nickName, email, userName) {
    const { status, message } = await authRepo.isHasSimilarNickOrEmail(
      nickName,
      email
    );
    if (status) return { status: 400, message };

    const hash = await bcrypt.hash(password, saltRounds);
    const confirmEmailKey = this.#genKey();

    await authRepo.createUser(userName, nickName, email, hash, confirmEmailKey);

    await sendEmailWithLink(
      email,
      "Подтверждение аккаунта",
      "Пройдите по ссылке, чтобы подтвердить свой аккаунт на Krainov forum",
      "confirm",
      confirmEmailKey
    );

    return {
      status: 200,
      message:
        "Аккаунт успешно зарегистрирован. На почту отправлено сообщение с инструкцией по дальнейшей активации!",
    };
  }
  async login(nickName, password) {
    const {
      status,
      id: userID,
      role,
      token: oldRefreshToken,
      message,
    } = await authRepo.isValidLogin(nickName, password);
    if (!status) return { status: 400, message };

    let refreshToken;
    const checkOldToken = await this.#compareToken(
      oldRefreshToken,
      refreshTokenSecret
    );
    if (checkOldToken && checkOldToken?.id == userID) {
      refreshToken = oldRefreshToken;
    } else {
      refreshToken = await this.#getToken(
        userID,
        role,
        refreshTokenSecret,
        refreshTokenLiveTime
      );
    }
    const accessToken = await this.#getToken(
      userID,
      role,
      accessTokenSecret,
      acessTokenLiveTime
    );
    await authRepo.saveToken(refreshToken, userID);
    return {
      status: 200,
      message: "Вход выполнен успешно!",
      refreshToken,
      accessToken,
    };
  }
  async logout(userID, refreshToken) {
    const compare = await this.#compareToken(refreshToken, refreshTokenSecret);
    if (!compare) return { status: 401, message: "Вы не авторизованы!" };
    if (userID !== compare.id)
      return { status: 401, message: "Вы не авторизованы!" };
    await authRepo.removeTokenByID(userID);
    return { status: 200, message: "Вы успешно вышли из системы!" };
  }
  async token(refreshToken) {
    try {
      const checkRefreshToken = await this.#compareToken(
        refreshToken,
        refreshTokenSecret
      );
      if (!checkRefreshToken)
        return { status: 401, message: "Вы не авторизованы!" };

      const userID = checkRefreshToken.id;
      const userRole = checkRefreshToken.role;

      const refreshTokenInBD = await authRepo.findRefreshTokenByUserID(userID);
      if (refreshToken !== refreshTokenInBD)
        return { status: 401, message: "Вы не авторизованы!" };

      const accessToken = await this.#getToken(
        userID,
        userRole,
        accessTokenSecret,
        acessTokenLiveTime
      );

      await AuthRepo.updateLastLogin(userID);

      return { status: 200, accessToken };
    } catch (e) {
      console.log(e);
      return { status: 401, message: "Вы не авторизованы!" };
    }
  }
  async confirm(key) {
    const userInfo = await AuthRepo.getUserInfoByConfirmKey(key);
    if (userInfo.length === 0)
      return {
        status: 400,
        message:
          "Указанный ключ не существует или время проведения операции истекло!",
      };
    const user = userInfo[0];

    const confirmTime = user.confirm_email_time;
    const emailToConfirm = user.email_to_confirm;
    if (new Date(confirmTime) < new Date())
      return {
        status: 400,
        message:
          "Указанный ключ не существует или время проведения операции истекло!",
      };
    if (emailToConfirm === null || emailToConfirm === "")
      return {
        status: 400,
        message:
          "Нет записи о новой электронной почте, попробуйте повторить операцию с самого начала через некоторое время!",
      };

    await authRepo.switchConfirm(key);
    return { status: 200, message: "Аккаунт успешно активирован!" };
  }
  async #getToken(id, role, secret, liveTime) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id, role },
        secret,
        { expiresIn: liveTime },
        function (err, token) {
          if (err) resolve(false);
          resolve(token);
        }
      );
    });
  }
  async #compareToken(token, secret) {
    return new Promise((resolve) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) resolve(false);
        resolve(decoded);
      });
    });
  }
  #genKey() {
    const variables =
      "QWERTYUIOPASDFGHJKLZXCVBNM0123456789qwertyuiopasdfghjklzxcvbnm";
    let key = "";
    for (let i = 1; i <= 29; i++) {
      const index = this.#random(variables.length - 1);
      key += variables[index];
    }
    return key;
  }
  #random(max) {
    let rand = Math.random() * (max + 1);
    return Math.floor(rand);
  }
}

export default new AuthServise();
