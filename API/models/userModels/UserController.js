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
  async getUserContent(req, res) {
    try {
      const { id: userID } = req.params;
      const { status, message, content } = await UserService.getUserContent(
        userID
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json(content);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
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
  async updatePasswordForgot(req, res) {
    try {
      const { email } = req.body;
      const { status, message } = await UserService.updatePasswordForgot(email);
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
        key
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
      const uploadDate = req?.uploadDate;
      const { status, message } = await UserService.updateAvatar(
        file,
        uploadDate,
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
      const uploadDate = req?.uploadDate;
      const { status, message } = await UserService.updateBackImg(
        file,
        uploadDate,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }

  async deleteAvatar(req, res) {
    try {
      const userID = req.userID;
      const { status, message } = await UserService.deleteAvatar(userID);
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async deleteBackImg(req, res) {
    try {
      const userID = req.userID;
      const { status, message } = await UserService.deleteBackImg(userID);
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
}

export default new UserController();
