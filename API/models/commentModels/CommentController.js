import CommentService from "./CommentService.js";

class CommentController {
  async getByPostID(req, res) {
    try {
      const { id } = req.params;
      const { page } = req.query;
      const userID = req?.userID || null;
      const userRole = req?.role || null;

      const { status, message, comments, maxPage } =
        await CommentService.getByPostID(id, page ? page : 1, userID, userRole);
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json({ comments, maxPage });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getAll(req, res) {
    try {
      const { page, filter } = req.query;
      const { status, message, comments, maxPage } =
        await CommentService.getAll(
          page ? page : 1,
          filter ? filter : "last-date-create"
        );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json({ comments, maxPage });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async createComment(req, res) {
    try {
      const { body, postID } = req.body;
      const { status, message } = await CommentService.createComment(
        body,
        postID,
        req.userID,
        req.role
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const { status, message } = await CommentService.deleteComment(
        id,
        req.userID,
        req.role
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateCommentBody(req, res) {
    try {
      const { commentID, body } = req.body;
      const { status, message } = await CommentService.updateCommentBody(
        commentID,
        body,
        req.userID,
        req.role
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateCommentVerified(req, res) {
    try {
      const { commentID, verified } = req.body;
      const { status, message } = await CommentService.updateCommentVerified(
        commentID,
        verified
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateCommentFixed(req, res) {
    try {
      const { commentID, fixed } = req.body;
      const { status, message } = await CommentService.updateCommentFixed(
        commentID,
        fixed
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
}

export default new CommentController();
