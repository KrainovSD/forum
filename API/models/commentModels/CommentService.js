import CommentRepo from "./CommentRepo.js";

class CommentService {
  async getAllByPostID(postID, page, userID) {
    const { comments, maxPage } = await CommentRepo.getAllByPostID(
      postID,
      page,
      userID
    );
    if (comments.length === 0 || maxPage === 0)
      return { status: 404, message: "Комментарии не найдены" };
    return { status: 200, comments, maxPage };
  }
  async createComment(body, postID, main, userID, role) {
    if (!(await CommentRepo.isHasPost(postID)))
      return { status: 400, message: "Темы не существует или она закрыта!" };
    await CommentRepo.createComment(body, postID, main, userID, role);
    return { status: 200, message: "Успешно!" };
  }
  async deleteComment(commentID, userID, userRole) {
    const comment = await CommentRepo.getComment(commentID);
    if (comment.length === 0)
      return { status: 400, message: "Комметария не существует!" };

    if (!this.#isHasAccessToComment(comment, userID, userRole, 1))
      return {
        status: 400,
        message:
          "Комметарий не пренадлежит пользователю или вышло время, когда он может быть удален!",
      };

    await CommentRepo.deleteComment(commentID);
    return { status: 200, message: "Успешно" };
  }
  async updateCommentBody(commentID, body, userID, userRole) {
    const comment = await CommentRepo.getComment(commentID);
    if (comment.length === 0)
      return { status: 400, message: "Комметария не существует!" };

    if (!this.#isHasAccessToComment(comment, userID, userRole, 24))
      return {
        status: 400,
        message:
          "Комметарий не пренадлежит пользователю или вышло время, когда он может быть изменен!",
      };
    await CommentRepo.updateCommentBody(commentID, body, userID);
    return { status: 200, message: "Успешно" };
  }
  async updateCommentVerified(commentID, verified) {
    const comment = await CommentRepo.getComment(commentID);
    if (comment.length === 0)
      return { status: 400, message: "Комметария не существует!" };
    await CommentRepo.updateCommentVerified(commentID, verified);
    return { status: 200, message: "Успешно" };
  }
  async updateCommentFixed(commentID, fixed) {
    const comment = await CommentRepo.getComment(commentID);
    if (comment.length === 0)
      return { status: 400, message: "Комметария не существует!" };
    await CommentRepo.updateCommentFixed(commentID, fixed);
    return { status: 200, message: "Успешно" };
  }

  #getDiffInHours(date) {
    const hours = 1000 * 60 * 60;
    const now = Math.floor(Date.now() / hours);
    const dateFirst = Math.floor(Date.parse(date) / hours);
    return now - dateFirst;
  }
  #isHasAccessToComment(comment, userID, userRole, accessDiff) {
    if (userRole !== "admin" && userRole !== "moder") {
      const diffInHours = this.#getDiffInHours(comment[0]?.date);
      if (
        comment[0]?.person_id !== userID ||
        !diffInHours ||
        (diffInHours > accessDiff && comment[0]?.verified)
      )
        return false;
    }
    return true;
  }
}

export default new CommentService();
