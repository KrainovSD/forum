import express from "express";
const router = express.Router();
import authController from "./AuthControllers.js";
import authValidation from "./authValidation.js";
import untils from "../../untils/index.js";

router.post(
  "/register",
  authValidation.register,
  untils.checkValidation,
  authController.register.bind(authController)
);

router.post(
  "/login",
  authValidation.login,
  untils.checkValidation,
  authController.login.bind(authController)
);

router.post(
  "/logout",
  untils.checkAuth,
  authController.logout.bind(authController)
);

router.post("/token", authController.token.bind(authController));

router.post(
  "/confirm",
  authValidation.confirm,
  untils.checkValidation,
  authController.confirm.bind(authController)
);

export default router;
