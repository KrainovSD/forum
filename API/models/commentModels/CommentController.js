import CommentService from "./CommentService.js";

class CommentController {
  async getAllByPostID(req, res) {
    const { id } = req.params;
    const { page } = req.query;

    const { status, message, comments, maxPage } =
      await CommentService.getAllByPostID(id, page ? page : 1);
    if (status !== 200) return res.status(status).json(message);
    return res.status(200).json({ comments, maxPage });
  }
}

export default new CommentController();
