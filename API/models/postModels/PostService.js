import PostRepo from "./PostRepo.js";
class PostService {
  async getAllByTopicID(topicID, page, filter, userID, userRole) {
    const { posts, maxPage } = await PostRepo.getAllByTopicID(
      topicID,
      page,
      filter,
      userID,
      userRole
    );
    if ((posts.length === 0 && maxPage == 0) || maxPage < page)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts, maxPage };
  }
  async getOneByID(id, userID, userRole) {
    const post = await PostRepo.getOneByID(id, userID, userRole);
    if (!post) return { status: 404, message: "Пост не найден" };
    return { status: 200, post };
  }
  async getLastPosts() {
    const posts = await PostRepo.getLastPosts();
    if (posts.length === 0)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts };
  }
  async updatePostTitle(postID, title, userID, userRole) {
    const post = PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    if (!this.#isHasAccessToPost(post, userID, userRole, 1))
      return {
        status: 400,
        message:
          "Пост не пренадлежит пользователю или вышло время, когда он может быть изменен!",
      };
    await PostRepo.updatePostTitle(postID, title);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostClosed(postID, value) {
    const post = PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.updatePostClosed(postID, value);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostVerified(postID, value) {
    const post = PostRepo.getPostByID(postID);
    const mainComment = PostRepo.getMainCommentByPostID(postID);
    if (post.length === 0 || mainComment.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.updatePostVerified(postID, value);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostFixed(postID, value) {
    const post = PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.updatePostFixed(postID, value);
    return { status: 200, message: "Успешно!" };
  }
  async deletePost(postID) {
    const post = PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.deletePost(postID);
    return { status: 200, message: "Успешно!" };
  }
  async createPost(title, topicID, userID, userRole) {
    if (!(await PostRepo.isHasTopic(topicID)))
      return {
        status: 400,
        message: "Топика не существует или создание постов в нем запрещено!",
      };
    await PostRepo.createPost(title, topicID, userID, userRole);
    return { status: 200, message: "Успешно!" };
  }

  #getDiffInHours(date) {
    const hours = 1000 * 60 * 60;
    const now = Math.floor(Date.now() / hours);
    const dateFirst = Math.floor(Date.parse(date) / hours);
    return now - dateFirst;
  }
  #isHasAccessToPost(post, userID, userRole, accessDiff) {
    const postInfo = post[0];
    if (userRole !== "admin" && userRole !== "moder") {
      const diffInHours = this.#getDiffInHours(postInfo?.date);
      if (postInfo?.person_id !== userID) return false;
      else if (userRole === "noob" && postInfo?.verified) return false;
      else if (diffInHours > accessDiff && postInfo?.verified) return false;
    }
    return true;
  }
}
export default new PostService();
