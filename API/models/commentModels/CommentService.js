import CommentRepo from "./CommentRepo.js";

class CommentService {
  async getAllByPostID(id, page) {
    const { comments, maxPage } = await CommentRepo.getAllByPostID(id, page);
    if (comments.length === 0 && maxPage === 0)
      return { status: 404, message: "Комментарии не найдены" };
    return { status: 200, comments, maxPage };
  }
}

export default new CommentService();
