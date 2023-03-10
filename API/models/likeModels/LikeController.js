import LikeService from "./LikeService.js";
class LikeController {
  async getAllByCommentID(req, res) {
    try {
      const { id } = req.params;
      const { status, message, likes } = await LikeService.getAllByCommentID(
        id
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json(likes);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async createLikeByCommentID(req, res) {
    try {
      const { commentID, authorCommentID } = req.body;
      const { status, message } = await LikeService.createLikeByCommentID(
        commentID,
        authorCommentID,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }

  async deleteLikeByCommentID(req, res) {
    try {
      const { id } = req.params;
      const { status, message } = await LikeService.deleteLikeByCommentID(
        id,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async deleteLikeByD(req, res) {
    try {
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
}
export default new LikeController();
