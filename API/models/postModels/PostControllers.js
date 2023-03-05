import PostService from "./PostService.js";

class PostController {
  async getAllByTopicID(req, res) {
    try {
      const { topicID } = req.params;
      const { page, filter } = req.query;
      const { status, message, posts, maxPage } =
        await PostService.getAllByTopicID(topicID, page, filter);
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json({ posts, maxPage });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getOneByID(req, res) {
    try {
      const { id } = req.params;
      const { status, message, post } = await PostService.getOneByID(id);
      if (status !== 200) return res.status(status).json(message);

      res.status(200).json(post);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async get(req, res) {
    try {
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
}

export default new PostController();
