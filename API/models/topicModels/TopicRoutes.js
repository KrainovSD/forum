import express from "express";
const router = express.Router();

import untils from "../../untils/index.js";
import TopicControllers from "./TopicControllers.js";
import topicValidation from "./topicValidation.js";

router.get("/:id", TopicControllers.getAllByID.bind(TopicControllers));

export default router;
