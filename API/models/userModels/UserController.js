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
  async getUserComments(req, res) {
    try {
      const { id: userID } = req.params;
      const { page } = req.query;
      const { status, message, userComments, maxPage } =
        await UserService.getUserComments(userID, page);
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json({ userComments, maxPage });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getUserPosts(req, res) {
    try {
      const { id: userID } = req.params;
      const { page, filter } = req.query;
      const { status, message, userPosts, maxPage } =
        await UserService.getUserPosts(userID, page, filter);
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json({ userPosts, maxPage });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateNickName(req, res) {
    try {
      const { nickName } = req.body;
      const { status, message } = await UserService.updateNickName(
        nickName,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updateUserName(req, res) {
    try {
      const { userName } = req.body;
      const { status, message } = await UserService.updateUserName(
        userName,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updatePasswordNote(req, res) {
    try {
      const { status, message } = await UserService.updatePasswordNote(
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updatePassword(req, res) {
    try {
      const { password, key } = req.body;
      const { status, message } = await UserService.updatePassword(
        password,
        key,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updateEmailNote(req, res) {
    try {
      const { status, message } = await UserService.updateEmailNote(req.userID);
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updateEmail(req, res) {
    try {
      const { email, key } = req.body;
      const { status, message } = await UserService.updateEmail(
        email,
        key,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updateAvatar(req, res) {
    try {
      const file = req?.file;
      const { status, message } = await UserService.updateAvatar(
        file,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updateBackImg(req, res) {
    try {
      const file = req?.file;
      const { status, message } = await UserService.updateBackImg(
        file,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
}

export default new UserController();
