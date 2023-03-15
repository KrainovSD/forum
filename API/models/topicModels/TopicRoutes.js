import express from "express";
const router = express.Router();

import untils from "../../untils/index.js";
import TopicControllers from "./TopicControllers.js";
import topicValidation from "./topicValidation.js";

router.get("/getChildren/:id", TopicControllers.getAllByID);
router.get("/access", TopicControllers.getAllForPost);
router.put(
  "/title",
  untils.checkAuth,
  untils.checkAdmin,
  topicValidation.update,
  untils.checkValidation,
  TopicControllers.updateTopicTitle
);
router.put(
  "/access",
  untils.checkAuth,
  untils.checkAdmin,
  topicValidation.update,
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
