const Comment = require("../models/comment");

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
    const {comment, post_id} = req.body;
    
    try {
      const result = await Comment.createComment(comment, post_id);
      console.log('New comment inserted successfully:', result);
      res.redirect('/forum');
      //res.status(200).send('Comment submitted successfully'); 
    } catch (err) {
      console.error('Error submitting comment:', err);
      res.status(500).send('Error submitting comment');
    }
};

module.exports = {
    createComment,
    getCommentById,
};