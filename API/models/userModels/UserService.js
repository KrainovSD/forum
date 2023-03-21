import { sendEmailWithLink } from "../../mailer.js";
import UserRepo from "./UserRepo.js";
import bcrypt from "bcrypt";
import { accessPromise } from "../../helpers/fsPromises.js";
import { unlink } from "node:fs/promises";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const saltRounds = 12;
const maxSizeAvatar = 5 * 1024 * 1024;
import { COUNT_COMMENT_FOR_SWITCH_USER_ROLE } from "../../const.js";

class UserService {
  async getUserByID(id) {
    const { userInfo, privateUserInfo } = await UserRepo.getUserByID(id);
    if (!userInfo || !privateUserInfo)
      return { status: 404, message: "Пользователь не найден!" };
    return { status: 200, userInfo, privateUserInfo };
  }
  async getUserContent(userID) {
    const content = await UserRepo.getUserContent(userID);
    if (content.length === 0)
      return { status: 404, message: "Контент пользователя не найден!" };
    return { status: 200, content };
  }

  async switchRoleToUser(userID) {
    const { userInfo } = await UserRepo.getUserByID(userID);
    console.log(userInfo);
    console.log(
      userInfo &&
        userInfo.role === "noob" &&
        userInfo.countComment >= COUNT_COMMENT_FOR_SWITCH_USER_ROLE
    );
    if (
      userInfo &&
      userInfo.role === "noob" &&
      userInfo.countComment >= COUNT_COMMENT_FOR_SWITCH_USER_ROLE
    )
      await UserRepo.switchRoleToUser(userID);
  }
  async updateNickName(nickName, userID) {
    if (!nickName) return { status: 400, message: "Пустое поле!" };
    await UserRepo.updateNickName(nickName, userID);
    return { status: 200, message: "Успешно!" };
  }
  async updateUserName(userName, userID) {
    if (!userName) return { status: 400, message: "Пустое поле!" };
    await UserRepo.updateUserName(userName, userID);
    return { status: 200, message: "Успешно!" };
  }

  async updatePasswordNote(userID) {
    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo.length === 0) throw new Error();
    const resetPasswordLast = userInfo[0].reset_password_last;
    const resetPasswordTime = userInfo[0].reset_password_time;
    if (!this.#isManyDiffPerDaysThanOne(resetPasswordLast))
      return {
        status: 400,
        message: "С прошлой смены пароля не прошел один день!",
      };
    if (new Date(resetPasswordTime) > new Date())
      return {
        status: 400,
        message:
          "Попытка сменить пароль уже начата, следуйте инструкциям на почте!",
      };

    const userEmail = userInfo[0].email;
    const changeKey = this.#genKey();

    await UserRepo.updatePasswordNote(userID, changeKey);
    await sendEmailWithLink(
      userEmail,
      "Смена пароля",
      "Для смены пароля пройдите по следующей ссылке, которая действительна в течении 5 минут: ",
      "password",
      changeKey
    );
    return {
      status: 200,
      message: "На электронную почту была выслана инструкция по смене пароля!",
    };
  }
  async updatePasswordForgot(email) {
    const userInfo = await UserRepo.getUserInfoByEmail(email);
    if (userInfo.length === 0)
      return {
        status: 400,
        message: "Указанный вами адресс электронной почты не существует!",
      };
    const resetPasswordLast = userInfo[0].reset_password_last;
    const resetPasswordTime = userInfo[0].reset_password_time;
    if (!this.#isManyDiffPerDaysThanOne(resetPasswordLast))
      return {
        status: 400,
        message: "С прошлой смены пароля не прошел один день!",
      };
    if (new Date(resetPasswordTime) > new Date())
      return {
        status: 400,
        message:
          "Попытка сменить пароль уже начата, следуйте инструкциям на почте!",
      };

    const userEmail = userInfo[0].email;
    const changeKey = this.#genKey();

    await UserRepo.updatePasswordNote(userInfo[0].id, changeKey);
    await sendEmailWithLink(
      userEmail,
      "Смена пароля",
      "Для смены пароля пройдите по следующей ссылке, которая действительна в течении 5 минут: ",
      "password",
      changeKey
    );
    return {
      status: 200,
      message: "На электронную почту была выслана инструкция по смене пароля!",
    };
  }
  async updatePassword(password, key) {
    const userInfo = await UserRepo.getUserInfoByPasswordKey(key);
    if (userInfo.length === 0)
      return {
        status: 400,
        message: "Ключ не существует или истекло время операции!",
      };
    const resetPasswordTime = userInfo[0].reset_password_time;
    if (new Date(resetPasswordTime) < new Date())
      return {
        status: 400,
        message: "Ключ не существует или истекло время операции!",
      };

    const hash = await bcrypt.hash(password, saltRounds);
    await UserRepo.updatePassword(hash, userInfo[0].id);
    return { status: 200, message: "Успешно!" };
  }

  async updateEmailNote(userID) {
    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo.length === 0) throw new Error();
    const confirmEmailLast = userInfo[0].confirm_email_last;
    const confirmEmailTime = userInfo[0].confirm_email_time;
    if (!this.#isManyDiffPerDaysThanOne(confirmEmailLast))
      return {
        status: 400,
        message: "С прошлой смены электронной почты не прошел один день!",
      };
    if (new Date(confirmEmailTime) > new Date())
      return {
        status: 400,
        message:
          "Попытка сменить электронную почту уже начата, следуйте инструкциям на почте!",
      };

    const userEmail = userInfo[0].email;
    const changeKey = this.#genKey();
    await UserRepo.updateEmailNote(userID, changeKey);
    await sendEmailWithLink(
      userEmail,
      "Смена электронной почты",
      "Для смены электронной почты пройдите по следующей ссылке, которая действительна в течении 5 минут: ",
      "email",
      changeKey
    );
    return {
      status: 200,
      message:
        "На электронную почту была выслана инструкция по смене электронной почты!",
    };
  }
  async updateEmail(email, key, userID) {
    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo.length === 0) throw new Error();

    const confirmEmailTime = userInfo[0].confirm_email_key;
    const confirmEmailKey = userInfo[0].confirm_email_key;
    const emailToConfirm = userInfo[0].email_to_confirm;
    if (emailToConfirm !== "")
      return {
        status: 400,
        message:
          "Произошла ошибка на одном из этапов изменения электронной почты! Внимательно изучите инструкцию, высланную на вашу старую электронную почту или повторите попытку сначала через какое то время!",
      };

    if (new Date(confirmEmailTime) < new Date() || confirmEmailKey !== key)
      return {
        status: 400,
        message: "Ключ не существует или истекло время операции!",
      };
    const newKey = this.#genKey();
    await UserRepo.updateEmail(email, newKey, userID);

    await sendEmailWithLink(
      email,
      "Смена электронной почты",
      "Для утверждения новой электронной почты пройдите по следующей ссылке, которая действительна в течении 5 минут: ",
      "confirm",
      newKey
    );
    return {
      status: 200,
      message:
        "Инструкция с дальнейшими указаниями выслана на вашу новую электронную почту!",
    };
  }
  #isManyDiffPerDaysThanOne(date) {
    const dateFirst = new Date(date);
    dateFirst.setDate(dateFirst.getDate() + 1);
    return dateFirst < new Date();
  }

  async updateAvatar(file, uploadDate, userID) {
    if (!file || file.size > maxSizeAvatar || !uploadDate)
      return {
        status: 400,
        message:
          "Аватар должен иметь разрешение PNG или GIF и размер не более 5MB!",
      };

    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo.length === 0) throw new Error();
    const avatar = userInfo[0].avatar;
    if (avatar !== null && avatar != "") {
      let dir = join(
        __dirname,
        "..",
        "..",
        "dist",
        "uploads",
        "userImg",
        `${userID}`,
        `${avatar}`
      );
      if (await accessPromise(dir)) await unlink(dir);
    }

    const extenstion = file.originalname.split(".");
    const name = `${file.fieldname}-${uploadDate}.${extenstion.at(-1)}`;
    await UserRepo.updateAvatar(name, userID);
    return { status: 200, message: "Успешно!" };
  }
  async updateBackImg(file, uploadDate, userID) {
    if (!file || file.size > maxSizeAvatar || !uploadDate)
      return {
        status: 400,
        message:
          "Фоновое изображение должно иметь разрешение PNG или GIF и размер не более 5MB!",
      };

    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo.length === 0) throw new Error();
    const backImg = userInfo[0].back_img;

    if (backImg !== null && backImg != "") {
      let dir = join(
        __dirname,
        "..",
        "..",
        "dist",
        "uploads",
        "userImg",
        `${userID}`,
        `${backImg}`
      );
      if (await accessPromise(dir)) await unlink(dir);
    }

    const extenstion = file.originalname.split(".");
    const name = `${file.fieldname}-${uploadDate}.${extenstion.at(-1)}`;
    await UserRepo.updateBackImg(name, userID);
    return { status: 200, message: "Успешно!" };
  }
  async deleteAvatar(userID) {
    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo[0].avatar === null || userInfo[0].avatar.length === 0)
      return {
        status: 400,
        message: "У пользователя нет аватара!",
      };
    let dir = join(
      __dirname,
      "..",
      "..",
      "dist",
      "uploads",
      "userImg",
      `${userID}`,
      `${userInfo[0].avatar}`
    );
    if (await accessPromise(dir)) await unlink(dir);
    await UserRepo.deleteAvatar(userID);
    return { status: 200, message: "Аватар успешно удален!" };
  }
  async deleteBackImg(userID) {
    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo[0].back_img === null || userInfo[0].back_img.length === 0)
      return {
        status: 400,
        message: "У пользователя нет обложки!",
      };
    let dir = join(
      __dirname,
      "..",
      "..",
      "dist",
      "uploads",
      "userImg",
      `${userID}`,
      `${userInfo[0].back_img}`
    );
    if (await accessPromise(dir)) await unlink(dir);
    await UserRepo.deleteBackImg(userID);
    return { status: 200, message: "Обложка профиля успешно удалена!" };
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

export default new UserService();
