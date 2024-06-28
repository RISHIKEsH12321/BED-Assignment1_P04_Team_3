const Post = require("../models/forum");

const getPostbyHeader = async (req, res) => {
  const postHeader = req.params.header;
  console.log("header " +postHeader);
  try {
    const post = await Post.getPostbyHeader(postHeader);
    if (!post) {
      return res.status(404).send("post not found");
    }
    res.json(post);
    //res.redirect("/forum");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving post");
  }
};

const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving posts");
    }
  };

const createPost = async (req, res) => {
    const { header, message } = req.body;
    
    try {
      const result = await Post.createPost(header, message);
      console.log('New post inserted successfully:', result);
      res.redirect('/forum');
      //res.status(200).send('Post submitted successfully'); 
    } catch (err) {
      console.error('Error submitting post:', err);
      res.status(500).send('Error submitting post');
    }
  };

// const updatePost = async (req, res) => {
//     const postId = parseInt(req.params.id);
//     const newPostData = req.body;
  
//     try {
//       const updatedPost = await Post.updatePost(postId, newPostData);
//       if (!updatedPost) {
//         return res.status(404).send("Post not found");
//       }
//       res.json(updatedPost);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error updating post");
//     }
//   };
// const deletePost = async (req, res) => {
//     const postId = parseInt(req.params.id);
  
//     try {
//       const success = await Book.deletePost(postId);
//       if (!success) {
//         return res.status(404).send("Post not found");
//       }
//       res.status(204).send();
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error deleting post");
//     }
//   };
  

module.exports = {
    getPostbyHeader,
    getAllPosts,
    createPost,
    // updatePost,
    // deletePost,
  };