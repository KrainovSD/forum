class MessagePostgressRepo {}
class MessageRepo {
  constructor(repo) {
    this.repo = repo;
  }
}

export default new MessageRepo(new MessagePostgressRepo());
