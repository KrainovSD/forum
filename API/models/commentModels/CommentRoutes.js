import express from "express";
const routes = express.Router();

import CommentController from "./CommentController.js";
import untils from "../../untils/index.js";
import commentValidation from "./commentValidation.js";

routes.get(
  "/byPost/:id",
  CommentController.getAllByPostID.bind(CommentController)
);

export default routes;
