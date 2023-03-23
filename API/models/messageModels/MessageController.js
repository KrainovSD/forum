import MessageService from "./MessageService.js";

class MessageController {
  async getSessionInfo(req, res) {
    try {
      const { status, message, messages } = await MessageService.getSessionInfo(
        req.userID
      );
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json(messages);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getSessionByID(req, res) {
    try {
      const { id: sessionID } = req.params;
      const { status, message, session } = await MessageService.getSessionByID(
        sessionID,
        req.userID
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json(session);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async getBySessionID(req, res) {
    try {
      const { id: sessionID } = req.params;
      const { page } = req.query;
      const { status, message, messages, maxPage } =
        await MessageService.getBySessionID(sessionID, page, req.userID);
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json({ maxPage, messages });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async createMessage(req, res) {
    try {
      const { body, members } = req.body;
      const allMembers = [...members, req.userID];
      const { status, message } = await MessageService.createMessage(
        body,
        allMembers,
        req.userID
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async deleteMessage(req, res) {
    try {
      const { messageID } = req.body;
      const { status, message } = await MessageService.deleteMessage(
        messageID,
        req.userID
      );
      res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async deleteSession(req, res) {
    try {
      const { id: sessionID } = req.params;
      const { status, message } = await MessageService.deleteSession(
        sessionID,
        req.userID
      );
      res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updateMessage(req, res) {
    try {
      const { messageID, body } = req.body;
      const { status, message } = await MessageService.updateMessage(
        messageID,
        body,
        req.userID
      );
      res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
}

export default new MessageController();
