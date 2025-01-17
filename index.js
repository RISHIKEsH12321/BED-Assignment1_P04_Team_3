const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const fileUpload = require('express-fileupload');
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

//Controllers
const User_Account_Controller = require("./controller/User_Account_Controller")
const Admin_Account_Controller = require("./controller/Admin_Account_Controller")
const Profile_Controller = require("./controller/Profile_controller")
const industry_info_controller = require("./controller/industry_info_controller");
const quiz_controller = require("./controller/quiz_controller")
const forumController = require("./controller/forumController");
const admin_forumController = require("./controller/admin_Forum_Controller");
const commentsController = require("./controller/commentsController");
const feedbackController = require("./controller/feedbackController");
const rolecontroller = require("./controller/getRoleController");
const YouTubeController = require('./controller/YoutubeController');
const geminiChatController = require("./controller/chatBotController");

//MiddleWare for each person
const validateIndustryAndQuiz = require("./middleware/industryAndQuizValidation");
const validateForum = require("./middleware/forumValidation");
const validateRole = require("./middleware/validateRole");
const validateCreateAccount = require('./middleware/AccountValidation');
const validateUpdateProfile = require('./middleware/ProfileChecker');

//Swagger 
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

app.use("/",express.static("public")); //Static Files start from public 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());
app.use(express.json()); 

const staticMiddleware = express.static("public");

// Serveing Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Home Page (Static)
app.get("/home", (req, res) => {
    const filePath = path.join(__dirname, "public", "html", "index.html");
    console.log("File path is" + filePath);
    // Read the index.html file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading index.html file:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Create a new JSDOM instance
        const dom = new JSDOM(data);

        // Serialize the modified document back to a string
        const document = dom.serialize();

        // Send the modified content as the response
        res.send(document);
    });
});

//Credits Page (Static)
app.get("/credits", (req,res) =>{
    const filePath = path.join(__dirname, "public", "html", "CreditScreen.html");
    console.log("File path is" + filePath);
    // Read the index.html file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading index.html file:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Create a new JSDOM instance
        const dom = new JSDOM(data);

        // Access the document object
        const document = dom.serialize();

        res.send(document);
    });
});

//Admin Actions Page (Static)
app.get("/adminActions", (req, res) => {
    const filePath = path.join(__dirname, "public", "html", "adminActions.html");
    console.log("File path is" + filePath);
    // Read the index.html file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading index.html file:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Create a new JSDOM instance
        const dom = new JSDOM(data);

        // Access the document object
        const document = dom.window.document;

        // Serialize the modified document back to a string
        const modifiedContent = dom.serialize();

        // Send the modified content as the response
        res.send(dom.serialize());
    });
});



// Users Route (Ye Chyang)
app.post("/users/account/login", User_Account_Controller.userlogin);
app.get("/users/account/:id", User_Account_Controller.getUserById); // get specific user
app.post("/users/account",validateCreateAccount.validateAccountUser,User_Account_Controller.createAccount); // Create user account
app.put("/users/account/:id", User_Account_Controller.updateUser); // Update user
app.delete("/users/account/:id", User_Account_Controller.deleteUser); // Delete user
app.get("/users/forgotpassword/:user_email", User_Account_Controller.userforgotpassword); // Forgot password
app.post("/users/check-password",User_Account_Controller.checkPassword)

// Admin Routes (Ye Chyang)
app.post("/admin/account/login", Admin_Account_Controller.adminlogin);
app.get("/admin/account", Admin_Account_Controller.getAllUsers); // Get all user
app.get("/admin/account/:id", Admin_Account_Controller.getUserById); // Get specific user
app.post("/admin/account/create",validateCreateAccount.validateAccountAdmin, Admin_Account_Controller.AdmincreateAccount); // Create Admin Account
app.put("/admin/account/:id", Admin_Account_Controller.AdminupdateUser); // Update Account
app.delete("/admin/account/:id", Admin_Account_Controller.AdmindeleteUser); // Delete Account 
app.get("/admin/forgotpassword/:user_email", Admin_Account_Controller.adminforgotpassword);
app.put("/admin/account/email/:id", Admin_Account_Controller.AdminupdateUserwithemail);

// Profile Routes
app.get("/account/profile/:id", Profile_Controller.getUserProfile);
app.put("/account/profile/:id",validateUpdateProfile, Profile_Controller.updateUserProfile);

// Youtube
app.get('/youtube/video/:videoId', YouTubeController.getVideoDetails); 
app.get('/youtube/search', YouTubeController.searchVideos);
app.post('/youtube/playlist', YouTubeController.createPlaylist); // Creating playlist
app.post('/youtube/allplaylist', YouTubeController.getAllPlaylist); // Getting all playlist
app.post('/youtube/addvideo', YouTubeController.addVideoToPlaylist); // Adding videos to playlist
app.get('/youtube/playlist/:playlist_id', YouTubeController.getPlaylistVideos); // Get videos in playlist
app.delete('/youtube/playlist/delete', YouTubeController.deletePlaylist); // Delete playlist
app.put('/youtube/playlist/update', YouTubeController.updatePlaylist); // Update playlist name and description
app.delete('/youtube/remove-video-from-playlist', YouTubeController.removeVideoFromPlaylist) // Remove video in playlist

app.get("/Videos", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "videos.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/Videos/playlist", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "videosplaylist.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
})

app.get("/playlist/:playlist_id", async (req, res) => {
    const filePath = path.join(__dirname, "public", "html", "videoinplaylist.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

// Route for Users and Admin account (Ye Chyang)
app.get("/accountselection", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "accountselection.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/registeruser", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "createuser.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/registeradmin", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "createadmin.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/loginuser", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "loginuser.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
})

app.get("/loginadmin", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "loginadmin.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
})

app.get("/admin/viewUser", (req, res) => {
    const filePath = path.join(__dirname, "public", "html", "allUsers.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/account-profile/:id", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "editprofile.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/account-personal/:id", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "editpersonal.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/profile/:id", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "profile.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});


//Industry Routes
app.get("/users/industry/:id", industry_info_controller.getIndustryInfo);//Get Industry data
app.get("/users/industry/", (req, res) => {
    res.status(400).send("Industry ID is required");
});
app.get("/admin/industry", industry_info_controller.displayAdminPage); // Dispaly Admin Page

app.get("/admin/api/industry", industry_info_controller.getAllIndustryInfo); // Get All challenges

app.post("/admin/industry", validateIndustryAndQuiz.validateAddChallenge, industry_info_controller.createNewChallenge); // Create new challenge

app.put("/admin/industry/challenge", validateIndustryAndQuiz.validateSaveChallenge, industry_info_controller.updateChallenge); // Update Challenge

app.put("/admin/industry/intro", validateIndustryAndQuiz.validateSaveIntro, industry_info_controller.updateIndustryInfo); // Update Industry Introduction

app.delete("/admin/industry/:id", validateIndustryAndQuiz.validateDeleteChallenge,industry_info_controller.deleteIndustryChallenge); // Delete Challenge

//Quiz Routes
app.get("/users/quiz/checkAnswers", quiz_controller.checkAnswers); //Check Answers and return result

app.get("/users/quiz/:id", quiz_controller.get15Questions); // Get and show questions

app.get("/admin/quiz", quiz_controller.displayAdminPage); //Dispaly Admin Page

app.get("/admin/api/quiz", quiz_controller.getAllQuestions); //Get all questions

app.put("/admin/quiz/update", validateIndustryAndQuiz.validateUpdateQuestion, quiz_controller.updateQuestion); // Update a question's details

app.post("/admin/quiz/create", validateIndustryAndQuiz.validateCreateQuestion,quiz_controller.createNewQuestion); // Make a new Question

app.delete("/admin/quiz/delete", validateIndustryAndQuiz.validateDeleteQuestion, quiz_controller.deleteQuestion); // Delete Question

//Gemini Chatbot Routes
app.post("/chatbot/history/:userId", geminiChatController.addNewChat); //Create a new Conversation

app.post("/chatbot/:conversationId", geminiChatController.postUserInput); //Post a request (promt) and get the response

app.get("/chatbot/:conversationId",geminiChatController.fetchChatHistory); //Gets all previous dialogs from both user and chatbot

app.post("/chatbot/conversation/:userId", geminiChatController.fetchChatByUserId); //Gets the conversations details like conversation id and title

app.put("/chatbot/conversation/:conversationId", geminiChatController.editChatTitle); //Edits Conversation Title

app.delete("/chatbot/conversation/:conversationId", geminiChatController.deleteChat);

app.get("/chatbot", geminiChatController.displatChatbotPage); // Displays the chatbot page

//User forum routes
app.get('/posts', forumController.getAllPosts); //Getting all post
app.get("/forum", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "forum.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});
app.get('/posts/:header',forumController.getPostbyHeader); //Getting post by searching the header
app.get('/post/id/:post_id', forumController.getPostById); //Route to display a post
app.post('/forum/post', validateForum.validatePost, forumController.createPost); // Route to handle creating a new post
app.put('/forum/update/:post_id', validateForum.validatePost, forumController.updatePost); // Route to update post
app.delete('/forum/delete/:post_id', forumController.deletePost); //Deleting the post

//Comments routes
app.get('/comments/:postId', commentsController.getCommentById); //Route to get comments
app.post('/comments', validateForum.validateComments, commentsController.createComment);// Post comments

//Admin forum routes
app.get('/admin/posts', admin_forumController.getAllPosts); //Getting all post for admin
app.get("/admin/forum", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "adminForum.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});
app.get('/admin/posts/:post_id',admin_forumController.getPostById); //Getting specific post
app.delete('/admin/forum/delete/:post_id', admin_forumController.deletePost); //Deleting the post
app.get('/admin/forum/comments', commentsController.getAllComments); //Getting all comments
app.get('/admin/forum/comments/:comment_id', commentsController.getCommentByCommentId); //Getting specific comment
app.delete('/admin/forum/comment/delete/:comment_id', commentsController.deleteComment); //Deleting the comment


//Feedback Routes
app.get("/admin/ongoingfeedback", feedbackController.getOngoingFeedback); // admin getting every ongoing feedback
app.get("/admin/resolvedfeedback", feedbackController.getResolvedFeedback); // admin getting all resolved feedback
app.post("/users/feedback", feedbackController.createFeedback); // users post feedbacks
app.get("/admin/feedback/:id", feedbackController.getFeedbackById); // admin getting viewing a specific feedback
app.put("/admin/resolve/:id", feedbackController.updateResolve); // admin changing the status of resolve on a feedback
app.put("/admin/fav/:id", feedbackController.updateFavourite); // admin can favourite/unfavourite a feedback
app.get("/admin/fav", feedbackController.getFavourite); // getting every favourited feedback
app.delete("/admin/feedback/:id", feedbackController.deleteFeedback); // admin delete feedback from the database

app.get("/aboutus", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "aboutus.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/contactus", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "contactus.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/feedbackform", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "feedbackform.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/ongoingfeedback", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "ongoingfeedback.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/resolvedfeedback", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "resolvedfeedback.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/favfeedback", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "favfeedback.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.get("/viewfeedback/:id", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "viewfeedback.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "public", "html", "pageNotFound.html"));
});

app.listen(port, async () => {
    try {
        // Connect to the database
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");

    } catch (err) {
        console.error("Database connection error:", err);
        // Terminate the application with an error code (optional)
        process.exit(1); // Exit with code 1 indicating an error
    }

    console.log(`Server listening on port ${port}`);
});
  
// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
});