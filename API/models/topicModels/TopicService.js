import TopicRepo from "./TopicRepo.js";

class TopicService {
  async getChildren(topicID) {
    const topicsInfo = await TopicRepo.getChildren(topicID);
    if (topicsInfo.topics.length == 0 && !topicsInfo.parentInfo)
      return { status: 404, message: "Топики не найдены!" };
    return {
      status: 200,
      topics: topicsInfo.topics,
      parentInfo: topicsInfo.parentInfo,
    };
  }
  async getAllChildren(topicID) {
    const { topic, children } = await TopicRepo.getAllChildren(topicID);
    if (!topic) return { status: 404, message: "Топик не найден!" };
    return { status: 200, topic, children };
  }
  async getAll(userRole) {
    const topics = await TopicRepo.getAll(userRole);
    if (topics.length === 0)
      return { status: 404, message: "Список топиков не найден!" };
    return { status: 200, topics };
  }
  async updateTopic(topicID, title, access, parentID) {
    const { topic, children } = await TopicRepo.getAllChildren(topicID);
    if (!topic) return { status: 400, message: "Топика не существует!" };
    if (children.includes(+parentID))
      return {
        status: 400,
        message:
          "Топик невозможно переместить в дочерний топик или внутрь самого себя!",
      };
    await TopicRepo.updateTopic(topicID, title, access, parentID);
    return { status: 200, message: "Успешно!" };
  }
  async updateTopicAccess(topicID, value) {
    const topic = await TopicRepo.getTopicByID(topicID);
    if (topic.length === 0)
      return { status: 400, message: "Топика не существует!" };
    await TopicRepo.updateTopicAccess(topicID, value);
    return { status: 200, message: "Успешно!" };
  }
  async createTopic(title, access, parentID) {
    if (parentID !== "null") {
      const topic = await TopicRepo.getTopicByID(parentID);
      if (topic.length === 0)
        return { status: 400, message: "Родительского топика не существует!" };
    }
    await TopicRepo.createTopic(title, access, parentID);
    return { status: 200, message: "Успешно!" };
  }
  async deleteTopic(topicID) {
    const topic = await TopicRepo.getTopicByID(topicID);
    if (topic.length === 0)
      return { status: 400, message: "Топика не существует!" };
    await TopicRepo.deleteTopic(topicID, topic[0].parent_id);
    return { status: 200, message: "Успешно!" };
  }
}
export default new TopicService();
