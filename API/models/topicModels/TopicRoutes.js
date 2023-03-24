import express from "express";
const router = express.Router();

import untils from "../../untils/index.js";
import TopicControllers from "./TopicControllers.js";
import topicValidation from "./topicValidation.js";

router.get("/children/:id", TopicControllers.getChildren);
router.get("/AllChildren/:id", TopicControllers.getAllChildren);
router.get("/access", untils.checkAuth, TopicControllers.getAll);
router.get("/parent/:id", TopicControllers.getParentInfo);
router.put(
  "/",
  untils.checkAuth,
  untils.checkAdmin,
  topicValidation.update,
  untils.checkValidation,
  TopicControllers.updateTopic
);
router.put(
  "/access",
  untils.checkAuth,
  untils.checkAdmin,
  topicValidation.updateValue,
  untils.checkValidation,
  TopicControllers.updateTopicAccess
);
router.post(
  "/",
  untils.checkAuth,
  untils.checkAdmin,
  topicValidation.create,
  untils.checkValidation,
  TopicControllers.createTopic
);
router.delete(
  "/:id",
  untils.checkAuth,
  untils.checkAdmin,
  TopicControllers.deleteTopic
);

export default router;
