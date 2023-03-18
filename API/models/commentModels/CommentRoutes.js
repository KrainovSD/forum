import express from "express";
const routes = express.Router();

import CommentController from "./CommentController.js";
import untils from "../../untils/index.js";
import commentValidation from "./commentValidation.js";

routes.get(
  "/byPost/:id",
  untils.noStrictCheckAuth,
  CommentController.getByPostID
);
routes.get(
  "/all",
  untils.checkAuth,
  untils.checkModer,
  CommentController.getAll
);
routes.post(
  "/",
  untils.checkAuth,
  commentValidation.create,
  untils.checkValidation,
  CommentController.createComment
);
routes.delete("/:id", untils.checkAuth, CommentController.deleteComment);
routes.put(
  "/body",
  untils.checkAuth,
  commentValidation.update,
  untils.checkValidation,
  CommentController.updateCommentBody
);
routes.put(
  "/verified",
  untils.checkAuth,
  untils.checkModer,
  commentValidation.update,
  untils.checkValidation,
  CommentController.updateCommentVerified
);
routes.put(
  "/fixed",
  untils.checkAuth,
  untils.checkModer,
  commentValidation.update,
  untils.checkValidation,
  CommentController.updateCommentFixed
);
export default routes;
