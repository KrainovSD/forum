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

class AuthServise {
  async register(password, nickName, email, userName) {
    const checkSimilarNickAndEmail = await authRepo.isHasSimilarNickOrEmail(
      nickName,
      email
    );
    if (checkSimilarNickAndEmail.status)
      return { status: 400, message: checkSimilarNickAndEmail.message };

    const hash = await bcrypt.hash(password, saltRounds);
    const confirmEmailKey = await bcrypt.genSalt(saltRounds);

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
    const checkLoginValid = await authRepo.isValidLogin(nickName, password);
    if (!checkLoginValid.status)
      return { status: 400, message: checkLoginValid.message };
    const { id: userID, token: oldRefreshToken, role } = checkLoginValid;

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
        refreshTokenSecret,
        refreshTokenLiveTime
      );
    }
    const accessToken = await this.#getToken(
      userID,
      accessTokenSecret,
      acessTokenLiveTime
    );
    const saveLogin = await authRepo.saveLogin(refreshToken, userID);
    return {
      status: 200,
      message: "Вход выполнен успешно!",
      refreshToken,
      accessToken,
      role,
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
      const { refreshTokenInBD, role } =
        await authRepo.findRefreshTokenAndRoleByUserID(checkRefreshToken.id);
      if (refreshToken !== refreshTokenInBD)
        return { status: 401, message: "Вы не авторизованы!" };

      const accessToken = await this.#getToken(
        checkRefreshToken.id,
        accessTokenSecret,
        acessTokenLiveTime
      );
      return { status: 200, accessToken, role };
    } catch (e) {
      return { status: 401, message: "Вы не авторизованы!" };
    }
  }
  async confirm(key) {
    let checkConfrimValid = await authRepo.isValidConfirm(key);
    if (!checkConfrimValid.status)
      return {
        status: 400,
        message: checkConfrimValid.message,
      };
    await authRepo.switchConfirm(key);
    return { status: 200, message: "Аккаунт успешно активирован!" };
  }

  async #getToken(id, secret, liveTime) {
    return new Promise((resolve, reject) => {
      jwt.sign({ id }, secret, { expiresIn: liveTime }, function (err, token) {
        if (err) resolve(false);
        resolve(token);
      });
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
}

export default new AuthServise();
