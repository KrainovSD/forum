import PostRepo from "./PostRepo.js";
import CommentService from "../commentModels/CommentService.js";

class PostService {
  async getByTopicID(topicID, page, filter, userID, userRole) {
    const { posts, maxPage } = await PostRepo.getByTopicID(
      topicID,
      page,
      filter,
      userID,
      userRole
    );
    if (posts.length === 0)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts, maxPage };
  }
  async getOneByID(id, userID, userRole) {
    const post = await PostRepo.getOneByID(id, userID, userRole);
    if (!post) return { status: 404, message: "Пост не найден" };
    const { viewed, updated } = await PostRepo.getViewedInfo(id, userID);
    if (updated) await PostRepo.switchUpdatedView(id, userID, false);
    if (!viewed) await PostRepo.addView(id, userID);
    return { status: 200, post };
  }
  async getLastPosts() {
    const posts = await PostRepo.getLastPosts();
    if (posts.length === 0)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts };
  }
  async getAll(page, filter, userID) {
    const { posts, maxPage } = await PostRepo.getAll(page, filter, userID);
    if (posts.length === 0)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts, maxPage };
  }
  async getPostAccessByID(postID, userID, userRole) {
    const post = await PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    if (!this.#isHasAccessToPost(post, userID, userRole, 1))
      return {
        status: 400,
        message:
          "Пост не пренадлежит пользователю или вышло время, когда он может быть изменен!",
      };
    const postInfo = await PostRepo.getOneByID(postID, userID, userRole);
    if (!postInfo) return { status: 400, message: "Поста не существует!" };

    return { status: 200, post: postInfo };
  }
  async getByUserID(userID, page, filter, reqUserID, reqUserRole) {
    const { posts, maxPage } = await PostRepo.getByUserID(
      userID,
      page,
      filter,
      reqUserID,
      reqUserRole
    );
    if (posts.length === 0)
      return { status: 404, message: "Посты не найдены!" };
    return { status: 200, posts, maxPage };
  }

  async updatePost(postID, title, topicID, userID, userRole) {
    const post = await PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    if (!this.#isHasAccessToPost(post, userID, userRole, 1))
      return {
        status: 400,
        message:
          "Пост не пренадлежит пользователю или вышло время, когда он может быть изменен!",
      };
    console.log(post[0].topic_id, topicID);
    if (
      post[0].topic_id !== topicID &&
      userRole !== "moder" &&
      userRole !== "admin"
    )
      return {
        status: 403,
        message: "Недостаточно прав для смены родительского топика!",
      };
    await PostRepo.updatePost(postID, title, topicID);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostClosed(postID, value) {
    const post = await PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.updatePostClosed(postID, value);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostVerified(postID, value) {
    const post = await PostRepo.getPostByID(postID);
    if (post.length === 0) throw new Error();
    await PostRepo.updatePostVerified(postID, value);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostVerifiedWithComment(postID, value) {
    const post = await PostRepo.getPostByID(postID);
    const mainComment = await PostRepo.getMainCommentByPostID(postID);
    if (post.length === 0 || mainComment === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.updatePostVerified(postID, value);
    await CommentService.updateCommentVerified(mainComment[0].id, value);
    return { status: 200, message: "Успешно!" };
  }
  async updatePostFixed(postID, value) {
    const post = await PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.updatePostFixed(postID, value);
    return { status: 200, message: "Успешно!" };
  }

  async deletePost(postID) {
    const post = await PostRepo.getPostByID(postID);
    if (post.length === 0)
      return { status: 400, message: "Поста не существует!" };
    await PostRepo.deletePost(postID);
    return { status: 200, message: "Успешно!" };
  }

  async createPost(body, title, topicID, userID, userRole) {
    const topic = await PostRepo.getTopicByID(topicID);
    if (topic.length === 0)
      return {
        status: 400,
        message: "Топика не существует или создание постов в нем запрещено!",
      };
    if (!topic[0].access_post && userRole !== "admin" && userRole !== "moder")
      return {
        status: 400,
        message: "Топика не существует или создание постов в нем запрещено!",
      };

    const post = await PostRepo.createPost(title, topicID, userID, userRole);
    await PostRepo.addView(post.id, userID);
    await PostRepo.createComment(body, post.id, userID, userRole);
    return { status: 200, message: "Успешно!" };
  }

  async switchAllUpdatedView(postID, userID) {
    await PostRepo.switchAllUpdatedView(postID, userID, true);
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
