import CommentRepo from "./CommentRepo.js";

class CommentService {
  async getByPostID(postID, page, userID, userRole) {
    if (userRole !== "admin" && userRole !== "moder")
      if (!(await CommentRepo.isHasPostAndVerify(postID, userID)))
        return { status: 404, message: "Комментарии не найдены!" };
    const { comments, maxPage } = await CommentRepo.getByPostID(
      postID,
      page,
      userID,
      userRole
    );
    if (comments.length === 0 || maxPage === 0)
      return { status: 404, message: "Комментарии не найдены" };
    return { status: 200, comments, maxPage };
  }
  async getAll(page, filter) {
    const { comments, maxPage } = await CommentRepo.getAll(page, filter);
    if (comments.length === 0)
      return { status: 404, message: "Комментарии не найдены!" };
    return { status: 200, comments, maxPage };
  }
  async createComment(body, postID, userID, role) {
    if (!(await CommentRepo.isHasPostAndOpen(postID)))
      return { status: 400, message: "Темы не существует или она закрыта!" };
    await CommentRepo.createComment(body, postID, userID, role);
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
    if (comment[0].main) {
      await CommentRepo.updatePostVerified(comment[0].post_id, verified);
    }
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
    const commentInfo = comment[0];
    if (userRole !== "admin" && userRole !== "moder") {
      const diffInHours = this.#getDiffInHours(commentInfo?.date);
      if (commentInfo?.person_id !== userID) return false;
      else if (userRole === "noob" && commentInfo?.verified) return false;
      else if (diffInHours > accessDiff && commentInfo?.verified) return false;
    }
    return true;
  }
}

export default new CommentService();
