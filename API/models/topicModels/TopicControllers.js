import TopicService from "./TopicService.js";

class TopicControllers {
  async getChildren(req, res) {
    try {
      const { id: topicID } = req.params;
      const result = await TopicService.getChildren(topicID);
      if (result.status !== 200)
        return res.status(result.status).json(result.message || "");

      res.status(200).json({
        topics: result.topics,
        parentInfo: result.parentInfo,
      });
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async getAllChildren(req, res) {
    try {
      const { id: topicID } = req.params;
      const { status, message, topic, children } =
        await TopicService.getAllChildren(topicID);
      if (status !== 200) return req.status(status).json(message);
      res.status(200).json({ topic, children });
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async getAll(req, res) {
    try {
      const { status, message, topics } = await TopicService.getAll(req.role);
      if (status !== 200) return res.status(status).json(message);
      res.status(200).json(topics);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getParentInfo(req, res) {
    try {
      const { id: topicID } = req.params;
      const { status, message, parentsInfo } = await TopicService.getParentInfo(
        topicID
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json(parentsInfo);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateTopic(req, res) {
    try {
      const { topicID, title, access, parentID } = req.body;
      const { status, message } = await TopicService.updateTopic(
        topicID,
        title,
        access,
        parentID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateTopicAccess(req, res) {
    try {
      const { topicID, value } = req.body;
      const { status, message } = await TopicService.updateTopicAccess(
        topicID,
        value
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async createTopic(req, res) {
    try {
      const { title, access, parentID } = req.body;

      const { status, message } = await TopicService.createTopic(
        title,
        access,
        parentID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async deleteTopic(req, res) {
    try {
      const { id: topicID } = req.params;
      const { status, message } = await TopicService.deleteTopic(topicID);
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
}

export default new TopicControllers();
