import PostRepo from "./PostRepo.js";
class PostService {
  async getAllByTopicID(topicID, page, filter) {
    const { posts, maxPage } = await PostRepo.getAllByTopicID(
      topicID,
      page,
      filter
    );
    if ((posts.length === 0 && maxPage == 0) || maxPage < page)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts, maxPage };
  }
  async getOneByID(id) {
    const post = await PostRepo.getOneByID(id);
    if (!post) return { status: 404, message: "Пост не найден" };
    return { status: 200, post };
  }
}
export default new PostService();
