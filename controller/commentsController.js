const Comment = require("../models/comment");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.getAllComments();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving comments");
  }
};

const getCommentById = async (req, res) => {
    const postId = req.params.postId;
    try {
      const comment = await Comment.getCommentById(postId);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving comments");
    }
};

const createComment = async (req, res) => {
    const {comment, post_id, author} = req.body;
    
    try {
      const result = await Comment.createComment(comment, post_id, author);
      console.log('New comment inserted successfully:', result);
      res.redirect('/forum');
      //res.status(200).send('Comment submitted successfully'); 
    } catch (err) {
      console.error('Error submitting comment:', err);
      res.status(500).send('Error submitting comment');
    }
};

const getCommentByCommentId = async (req, res) => {
  const commentId = parseInt(req.params.comment_id);
  try {
    const comment = await Comment.getCommentByCommentId(commentId);
    if (!comment) {
      return res.status(404).send("Comment not found");
    }
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving comment");
  }
};

const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.comment_id);

  try {
    const success = await Comment.deleteComment(commentId);
    if (!success) {
      return res.status(404).send("Comment not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting comment");
  }
};


module.exports = {
  getAllComments,
  createComment,
  getCommentById,
  getCommentByCommentId,
  deleteComment,
};