import UserRepo from "./UserRepo.js";

class UserService {
  async getUserByID(id) {
    const { userInfo, privateUserInfo } = await UserRepo.getUserByID(id);
    if (!userInfo || !privateUserInfo)
      return { status: 404, message: "Пользователь не найден!" };
    return { status: 200, userInfo, privateUserInfo };
  }
}

export default new UserService();
