import express from "express";

const router = express.Router();
import untils from "../../untils/index.js";
import PostControllers from "./PostControllers.js";
import postValidation from "./postValidation.js";

router.get(
  "/byTopic/:topicID",
  untils.noStrictCheckAuth,
  PostControllers.getAllByTopicID
);
router.get("/byID/:id", untils.noStrictCheckAuth, PostControllers.getOneByID);
router.get("/last", PostControllers.getLastPosts);
router.put(
  "/title",
  untils.checkAuth,
  postValidation.update,
  untils.checkValidation,
  PostControllers.updatePostTitle
);
router.put(
  "/closed",
  untils.checkAuth,
  untils.checkModer,
  postValidation.update,
  untils.checkValidation,
  PostControllers.updatePostClosed
);
router.put(
  "/verified",
  untils.checkAuth,
  untils.checkModer,
  postValidation.update,
  untils.checkValidation,
  PostControllers.updatePostVerified
);
router.put(
  "/fixed",
  untils.checkAuth,
  untils.checkModer,
  postValidation.update,
  untils.checkValidation,
  PostControllers.updatePostFixed
);
router.delete(
  "/:id",
  untils.checkAuth,
  untils.checkModer,
  PostControllers.deletePost
);
router.post(
  "/",
  untils.checkAuth,
  postValidation.create,
  untils.checkValidation,
  PostControllers.createPost
);

export default router;
