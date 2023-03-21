import PostService from "./PostService.js";

class PostController {
  async getByTopicID(req, res) {
    try {
      const { topicID } = req.params;
      const { page, filter } = req.query;
      const userID = req?.userID ? req.userID : null;
      const userRole = req?.role ? req.role : null;
      const { status, message, posts, maxPage } =
        await PostService.getByTopicID(
          topicID,
          page ? page : 1,
          filter ? filter : "last-date-create",
          userID,
          userRole
        );
      if (status !== 200) return res.status(status).json(message);

      return res.status(200).json({ posts, maxPage });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getOneByID(req, res) {
    try {
      const { id } = req.params;
      const userID = req?.userID ? req.userID : null;
      const userRole = req?.role ? req.role : null;

      const { status, message, post } = await PostService.getOneByID(
        id,
        userID,
        userRole
      );
      if (status !== 200) return res.status(status).json(message);

      res.status(200).json(post);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getLastPosts(req, res) {
    try {
      const { status, message, posts } = await PostService.getLastPosts();
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json(posts);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getAll(req, res) {
    try {
      const { page, filter } = req.query;
      const { status, message, posts, maxPage } = await PostService.getAll(
        page ? page : 1,
        filter ? filter : "last-date-create"
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json({ maxPage, posts });
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async getByUserID(req, res) {
    try {
      const { userID } = req.params;
      const { page, filter } = req.query;
      const reqUserID = req.userID ? req.userID : null;
      const reqUserRole = req.role ? req.role : null;
      const { status, message, maxPage, posts } = await PostService.getByUserID(
        userID,
        page ? page : 1,
        filter ? filter : "last-date-create",
        reqUserID,
        reqUserRole
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json({ maxPage, posts });
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async getPostAccessByID(req, res) {
    try {
      const { id } = req.params;
      const { status, message, post } = await PostService.getPostAccessByID(
        id,
        req.userID,
        req.role
      );
      if (status !== 200) return res.status(status).json(message);
      return res.status(200).json(post);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async updatePost(req, res) {
    try {
      const { postID, title, topicID } = req.body;
      const { status, message } = await PostService.updatePost(
        postID,
        title,
        topicID,
        req.userID,
        req.role
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updatePostClosed(req, res) {
    try {
      const { postID, value } = req.body;
      const { status, message } = await PostService.updatePostClosed(
        postID,
        value
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updatePostVerified(req, res) {
    try {
      const { postID, value } = req.body;
      const { status, message } =
        await PostService.updatePostVerifiedWithComment(postID, value);
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async updatePostFixed(req, res) {
    try {
      const { postID, value } = req.body;
      const { status, message } = await PostService.updatePostFixed(
        postID,
        value
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      res.status(500).json();
    }
  }
  async deletePost(req, res) {
    try {
      const { id: postID } = req.params;
      const { status, message } = await PostService.deletePost(postID);
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
  async createPost(req, res) {
    try {
      const { title, body, topicID } = req.body;
      const { status, message } = await PostService.createPost(
        body,
        title,
        topicID,
        req.userID,
        req.role
      );
      return res.status(status).json(message);
    } catch (e) {
      req.err = e;
      return res.status(500).json();
    }
  }
}

export default new PostController();
