import express from "express";
const router = express.Router();

import UserController from "./UserController.js";
import untils from "../../untils/index.js";
import userValidation from "./userValidation.js";

router.get("/me", untils.checkAuth, UserController.getMe);
router.get("/list", untils.checkAuth, UserController.getAll);
router.get("/:id", UserController.getByID);
router.get("/content/:id", UserController.getUserContent);
router.put(
  "/nickName",
  untils.checkAuth,
  userValidation.updateNickName,
  untils.checkValidation,
  UserController.updateNickName
);
router.put(
  "/userName",
  untils.checkAuth,
  userValidation.updateUserName,
  untils.checkValidation,
  UserController.updateUserName
);
router.put(
  "/password/note",
  untils.checkAuth,
  UserController.updatePasswordNote
);
router.put(
  "/password/forgot",
  userValidation.updatePasswordForgot,
  untils.checkValidation,
  UserController.updatePasswordForgot
);
router.put("/email/note", untils.checkAuth, UserController.updateEmailNote);

router.put(
  "/password",
  userValidation.updatePassword,
  untils.checkValidation,
  UserController.updatePassword
);
router.put(
  "/email",
  untils.checkAuth,
  userValidation.updateEmail,
  untils.checkValidation,
  UserController.updateEmail
);

router.put(
  "/avatar",
  untils.checkAuth,
  untils.multer.single("avatar"),
  UserController.updateAvatar
);
router.put(
  "/backImg",
  untils.checkAuth,
  untils.multer.single("backImg"),
  UserController.updateBackImg
);
router.delete("/avatar", untils.checkAuth, UserController.deleteAvatar);
router.delete("/backImg", untils.checkAuth, UserController.deleteBackImg);

export default router;
