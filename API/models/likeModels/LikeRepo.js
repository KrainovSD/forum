class LikePostgressRepo {}

class LikeRepo {
  constructor(repo) {
    this.repo = repo;
  }
}

export default new LikeRepo(new LikePostgressRepo());
