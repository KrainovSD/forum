import TopicRepo from "./TopicRepo.js";

class TopicService {
  async getAllByID(id) {
    const topicsInfo = await TopicRepo.getAllByID(id);
    if (topicsInfo.topics.length == 0 && !topicsInfo.parentInfo)
      return { status: 404, message: "Топики не найдены!" };
    return {
      status: 200,
      topics: topicsInfo.topics,
      parentInfo: topicsInfo.parentInfo,
    };
  }
  async getAllForPost() {
    const topics = await TopicRepo.getAllForPost();
    if (topics.length === 0)
      return { status: 404, message: "Список топиков не найден!" };
    return { status: 200, topics };
  }
  async updateTopicTitle(topicID, title) {
    const topic = await TopicRepo.getTopicByID(topicID);
    if (topic.length === 0)
      return { status: 400, message: "Топика не существует!" };
    await TopicRepo.updateTopicTitle(topicID, title);
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
