import LikeRepo from "./LikeRepo.js";
class LikeService {
  async getAllByCommentID(id) {
    const { likes } = await LikeRepo.getAllByCommentID(id);
    if (likes.length === 0)
      return { status: 404, message: "Лайки не найдены!" };
    return { status: 200, likes };
  }
}
export default new LikeService();
