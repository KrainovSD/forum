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

class UserService {
  async getUserByID(id) {
    const { userInfo, privateUserInfo } = await UserRepo.getUserByID(id);
    if (!userInfo || !privateUserInfo)
      return { status: 404, message: "Пользователь не найден!" };
    return { status: 200, userInfo, privateUserInfo };
  }
  async getUserComments(userID, page) {
    const { userComments, maxPage } = await UserRepo.getUserComments(
      userID,
      page
    );
    console.log(userComments);
    if (userComments.length === 0)
      return { status: 404, message: "Сообщения пользователя не найдены!" };
    return { status: 200, userComments, maxPage };
  }
  async getUserPosts(userID, page, filter) {
    const { userPosts, maxPage } = await UserRepo.getUserPosts(
      userID,
      page,
      filter
    );
    if (userPosts.length === 0)
      return { status: 404, message: "Сообщения пользователя не найдены!" };
    return { status: 200, userPosts, maxPage };
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
      "changePassword",
      changeKey
    );
    return {
      status: 200,
      message: "На электронную почту была выслана инструкция по смене пароля!",
    };
  }
  async updatePassword(password, key, userID) {
    const userInfo = await UserRepo.getUserInfo(userID);
    if (userInfo.length === 0) throw new Error();
    const resetPasswordTime = userInfo[0].reset_password_time;
    const resetPasswordKey = userInfo[0].reset_password_key;
    if (new Date(resetPasswordTime) < new Date() || resetPasswordKey !== key)
      return {
        status: 400,
        message: "Ключ не существует или истекло время операции!",
      };

    const hash = await bcrypt.hash(password, saltRounds);
    await UserRepo.updatePassword(hash, userID);
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
      "changeEmail",
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
  async updateAvatar(file, userID) {
    if (!file || file.size > maxSizeAvatar)
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
      if (accessPromise(dir)) await unlink(dir);
    }
    await UserRepo.updateAvatar(file.originalname, userID);
    return { status: 200, message: "Успешно!" };
  }
  async updateBackImg(file, userID) {
    if (!file || file.size > maxSizeAvatar)
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
      if (accessPromise(dir)) await unlink(dir);
    }
    await UserRepo.updateBackImg(file.originalname, userID);
    return { status: 200, message: "Успешно!" };
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
