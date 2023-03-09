import express from "express";
const router = express.Router();

import LikeController from "./LikeController.js";
import untils from "../../untils/index.js";
import likeValidation from "./likeValidation.js";

router.get(
  "/byComment/:id",
  LikeController.getAllByCommentID.bind(LikeController)
);

export default router;
