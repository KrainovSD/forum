import authService from "./AuthService.js";
import * as dotenv from "dotenv";
dotenv.config({ path: "environment.env", silent: true });
const cookiesLiveTime = process.env.COOKIES_LIVE_TIME;
const PRODUCTION = process.env.PRODUCTION || false;

class AuthController {
  async register(req, res) {
    try {
      const { password, nickName, email, userName } = req.body;
      const result = await authService.register(
        password,
        nickName,
        email,
        userName
      );

      return res.status(result.status).json(result.message || "");
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async login(req, res) {
    try {
      const { nickName, password } = req.body;
      const result = await authService.login(nickName, password);
      if (result.status !== 200)
        return res.status(result.status).json(result.message || "");

      await this.#setTokenInCookies(result.refreshToken, res);

      return res
        .status(result.status)
        .json({ message: result.message || "", token: result.accessToken });
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async logout(req, res) {
    try {
      const userID = req.userID;
      const { token: refreshToken } = req.cookies;
      const result = await authService.logout(userID, refreshToken);

      return res
        .clearCookie("token")
        .status(result.status)
        .json(result.message || "");
    } catch (e) {
      req.err = e;
      return res.clearCookie("token").status(500).json();
    }
  }
  async token(req, res) {
    try {
      const { token: refreshToken } = req.cookies;
      const result = await authService.token(refreshToken);

      if (result.status !== 200)
        return res.status(result.status).json(result.message || "");

      return res
        .status(result.status)
        .json({ token: result.accessToken, role: result.role });
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async confirm(req, res) {
    try {
      const { key } = req.body;
      const result = await authService.confirm(key);

      return res.status(result.status).json(result.message || "");
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async #setTokenInCookies(token, res) {
    const maxAge = 1000 * 60 * 60 * 24 * cookiesLiveTime;

    if (!PRODUCTION) {
      res.cookie("token", token, {
        httpOnly: true,
        maxAge,
        //sameSite: 'None', // DEV OPTIONS strict - if UI exist inside domain
        //secure: true, // DEV OPTIONS true - if app use https protocol
      });
    } else {
      res.cookie("refreshToken", token, {
        httpOnly: true,
        maxAge,
        sameSite: "strict",
        secure: true,
      });
    }
  }
}

export default new AuthController();
