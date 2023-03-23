import express from "express";
const router = express.Router();

import MessageController from "./MessageController.js";
import messageValidation from "./messageValidation.js";
import untils from "../../untils/index.js";

router.get("/last", untils.checkAuth, MessageController.getSessionInfo);
router.get(
  "/bySession/:id",
  untils.checkAuth,
  MessageController.getBySessionID
);
router.get("/session/:id", untils.checkAuth, MessageController.getSessionByID);
router.post(
  "/",
  untils.checkAuth,
  messageValidation.create,
  untils.checkValidation,
  MessageController.createMessage
);
router.post(
  "/delete",
  messageValidation.remove,
  untils.checkValidation,
  untils.checkAuth,
  MessageController.deleteMessage
);
router.delete(
  "/session/:id",
  untils.checkAuth,
  MessageController.deleteSession
);
router.put(
  "/",
  untils.checkAuth,
  messageValidation.update,
  untils.checkValidation,
  MessageController.updateMessage
);
export default router;
