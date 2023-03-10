import express from "express";
const router = express.Router();

import MessageController from "./MessageController.js";
import messageValidation from "./messageValidation.js";
import untils from "../../untils/index.js";

router.get("/last", untils.checkAuth, MessageController.getLastMessages);
router.get(
  "/bySession/:id",
  untils.checkAuth,
  MessageController.getBySessionID
);
router.post(
  "/",
  untils.checkAuth,
  messageValidation.create,
  untils.checkValidation,
  MessageController.createMessage
);

export default router;
