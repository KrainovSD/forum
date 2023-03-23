import MessageRepo from "./MessageRepo.js";
class MessageService {
  async getSessionInfo(userID) {
    const messages = await MessageRepo.getSessionInfo(userID);
    if (messages.length === 0)
      return { status: 404, message: "Сообщения не найдены!" };
    return { status: 200, messages };
  }
  async getSessionByID(sessionID, userID) {
    const session = await MessageRepo.getSessionByID(sessionID, userID);
    if (!session) return { status: 404, message: "Сессия не найдена!" };
    return { status: 200, session };
  }
  async getBySessionID(sessionID, page, userID) {
    if (!(await MessageRepo.isHasActiveSession(sessionID, userID)))
      return { status: 400, message: "Сессии не существует!" };

    const { messages, maxPage } = await MessageRepo.getBySessionID(
      sessionID,
      page,
      userID
    );
    if (messages.length === 0)
      return { status: 404, message: "Сообщения не найдены!" };

    await MessageRepo.updateView(sessionID, userID);
    return { status: 200, messages, maxPage };
  }
  async createMessage(body, members, userID) {
    let sessionID = await MessageRepo.findSessionIDByMembers(members);
    await MessageRepo.createMessage(body, userID, sessionID);
    await MessageRepo.openSessionByMembers(members, sessionID);

    return { status: 200, message: "Успешно!" };
  }
  async deleteMessage(messageID, userID) {
    const messages = await MessageRepo.getMessagesByID(messageID, userID);
    console.log(messages);
    if (messages.length !== messageID.length)
      return { status: 400, message: "Произошла ошибка при удалении!" };
    console.log(messages);
    await MessageRepo.deleteMessage(messageID, userID);
    return { status: 200, message: "Успешно!" };
  }
  async deleteSession(sessionID, userID) {
    if (!(await MessageRepo.isHasAccessToSession(sessionID, userID)))
      return { status: 400, message: "Сессия не доступна для закрытия!" };
    await MessageRepo.closeSession(sessionID, userID);
    await MessageRepo.deleteAllMessageBySession(sessionID, userID);
    return { status: 200, message: "Успешно!" };
  }
  async updateMessage(messageID, body, userID) {
    const message = await MessageRepo.getMessageByID(messageID);
    if (message.length === 0)
      return { status: 400, message: "Сообщения не существует!" };
    if (!this.#isHasAccessToMessage(message, userID, 1))
      return { status: 403, message: "Нет доступа к сообщению!" };
    await MessageRepo.updateMessage(messageID, body);
    return { status: 200, message: "Успешно!" };
  }

  #getDiffInHours(date) {
    const hours = 1000 * 60 * 60;
    const now = Math.floor(Date.now() / hours);
    const dateFirst = Math.floor(Date.parse(date) / hours);
    return now - dateFirst;
  }
  #isHasAccessToMessage(message, userID, accessDiff) {
    const messageInfo = message[0];
    const diffInHours = this.#getDiffInHours(messageInfo?.date);
    if (messageInfo?.from !== userID) return false;
    else if (diffInHours > accessDiff) return false;
    else if (messageInfo?.deleted?.includes(userID)) return false;
    return true;
  }
}
export default new MessageService();
