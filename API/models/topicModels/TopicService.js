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
}
export default new TopicService();
