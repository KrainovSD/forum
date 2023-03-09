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

  async getAll(req, res) {
    try {
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
}
export default new LikeController();
