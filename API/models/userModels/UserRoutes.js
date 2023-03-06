import express from "express";
const router = express.Router();

import UserController from "./UserController.js";
import untils from "../../untils/index.js";
import userValidation from "./userValidation.js";

router.get("/me", untils.checkAuth, UserController.getMe.bind(UserController));
router.get("/:id", UserController.getByID.bind(UserController));

export default router;
