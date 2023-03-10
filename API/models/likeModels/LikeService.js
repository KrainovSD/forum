import LikeRepo from "./LikeRepo.js";
class LikeService {
  async getAllByCommentID(id) {
    const { likes } = await LikeRepo.getAllByCommentID(id);
    if (likes.length === 0)
      return { status: 404, message: "Лайки не найдены!" };
    return { status: 200, likes };
  }
  async createLikeByCommentID(commentID, authorComment, authorLike) {
    if (authorLike === authorComment)
      return {
        status: 400,
        message: "Автор комментария и автор лайка один и тот же пользователь!",
      };
    if (!(await LikeRepo.isHasComment(commentID, authorComment)))
      return { status: 400, message: "Комментария не существует!" };
    if (await LikeRepo.isHasLike(commentID, authorLike))
      return { status: 400, message: "Лайк уже существует!" };
    await LikeRepo.createLike(commentID, authorComment, authorLike);
    return { status: 200, message: "Успешно!" };
  }
  async deleteLikeByCommentID(commentID, authorLike) {
    if (!(await LikeRepo.isHasLike(commentID, authorLike)))
      return { status: 400, message: "Лайка не существует!" };
    await LikeRepo.deleteLike(commentID, authorLike);
    return { status: 200, message: "Успешно!" };
  }
}
export default new LikeService();
