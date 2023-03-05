class UserPosgressRepo {}
class UserRepo {
  constructor(repo) {
    this.repo = repo;
  }
}

export default new UserRepo(new UserPosgressRepo());
