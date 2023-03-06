import UserService from "./UserService.js";

class UserController {
  async getByID(req, res) {
    try {
      const { id } = req.params;
      const { status, message, userInfo } = await UserService.getUserByID(id);
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json(userInfo);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getMe(req, res) {
    try {
      const { status, message, privateUserInfo } =
        await UserService.getUserByID(req.userID);
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json(privateUserInfo);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }

  async getBy(req, res) {
    try {
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
}

export default new UserController();
