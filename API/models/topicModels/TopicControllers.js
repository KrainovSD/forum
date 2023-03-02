import TopicService from "./TopicService.js";

class TopicControllers {
  async getAllByID(req, res) {
    try {
      const { id } = req.params;
      const result = await TopicService.getAllByID(id);
      if (result.status !== 200)
        return res.status(result.status).json(result.message || "");

      res
        .status(200)
        .json({ topics: result.topics, parentTitle: result.parentTitle });
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async get(req, res) {
    try {
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
}

export default new TopicControllers();
