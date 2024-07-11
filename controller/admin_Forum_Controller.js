//Done by Joseph
const Admin_Forum = require("../models/admin_Forum");
const validateRole = require("../middleware/validateRole");

const getAllPosts = async (req, res) => {
    try {
      const role = await validateRole.validateUserRole(req);
      if (role === "admin") {
      const posts = await Admin_Forum.getAllPosts();
      res.json(posts);
    } else {
      return res.status(401).json({ message: "Access error", details: role });
    }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving posts");
    }
};

const getPostById = async (req, res) => {
    const postId = parseInt(req.params.post_id);
    try {
      const post = await Admin_Forum.getPostById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving post");
    }
};

const deletePost = async (req, res) => {
  const postId = parseInt(req.params.post_id);

  try {
    const success = await Admin_Forum.deletePost(postId);
    if (!success) {
      return res.status(404).send("Post not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting post");
  }
};


module.exports = {
    getAllPosts,
    getPostById,
    deletePost,
  };