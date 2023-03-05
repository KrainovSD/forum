import express from "express";

const router = express.Router();
import untils from "../../untils/index.js";
import PostControllers from "./PostControllers.js";
import postValidation from "./postValidation.js";

router.get(
  "/byTopic/:topicID",
  PostControllers.getAllByTopicID.bind(PostControllers)
);
router.get("/byID/:id", PostControllers.getOneByID.bind(PostControllers));

export default router;
