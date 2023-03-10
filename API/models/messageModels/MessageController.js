import MessageService from "./MessageService.js";

class MessageController {
  async getLastMessages(req, res) {
    try {
      const { status, message, messages } =
        await MessageService.getLastMessages(req.userID);
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json(messages);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getBySessionID(req, res) {
    try {
      const { id: sessionID } = req.params;
      const { status, message, messages } = await MessageService.getBySessionID(
        sessionID,
        req.userID
      );
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json(messages);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async createMessage(req, res) {
    try {
      const { body } = req.body;
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
}

export default new MessageController();
