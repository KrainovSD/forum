import MessageRepo from "./MessageRepo.js";
class MessageService {
  async getLastMessages(userID) {
    const messages = await MessageRepo.getLastMessages(userID);
    if (messages.length === 0)
      return { status: 404, message: "Сообщения не найдены!" };
    return { status: 200, messages };
  }
  async getBySessionID(sessionID, userID) {
    if (!(await MessageRepo.isHasSession(sessionID, userID)))
      return { status: 400, message: "Сессии не существует!" };

    const messages = await MessageRepo.getBySessionID(sessionID, userID);
    if (messages.length === 0)
      return { status: 404, message: "Сообщения не найдены!" };
    return { status: 200, messages };
  }
}
export default new MessageService();
