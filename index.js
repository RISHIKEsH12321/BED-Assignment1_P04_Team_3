const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const fileUpload = require('express-fileupload');

//Controllers
const User_Account_Controller = require("./controller/User_Account_Controller")
const Admin_Account_Controller = require("./controller/Admin_Account_Controller")
const Profile_Controller = require("./controller/Profile_controller")
const industry_info_controller = require("./controller/industry_info_controller");
const quiz_controller = require("./controller/quiz_controller")
const forumController = require("./controller/forumController");
const commentsController = require("./controller/commentsController");
const feedbackController = require("./controller/feedbackController");

//MiddleWare for each person
const validateIndustryAndQuiz = require("./middleware/industryAndQuizValidation");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

app.use("/",express.static("public")); //Static Files start from public 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());
app.use(express.json()); 

const staticMiddleware = express.static("public");

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

        // Access the document object
        const document = dom.window.document;

        // Locate the div with id "modifyTest" and insert new content
        const divToModify = document.getElementById("modifyTest");
        if (divToModify) {
            const divToInsert = document.createElement("div");
            divToInsert.textContent = "Asdasd";

            const newElement = document.createElement("h1");
            newElement.id = "TestSubject1";
            newElement.textContent = "New Element";

            divToModify.appendChild(divToInsert);
            divToModify.appendChild(newElement);
        }

        // Serialize the modified document back to a string
        const modifiedContent = dom.serialize();

        // Send the modified content as the response
        res.send(modifiedContent);
    });
});


app.post("/users/account/login", User_Account_Controller.userlogin);
app.get("/users/account/:id", User_Account_Controller.getUserById); // get specific user
app.post("/users/account", User_Account_Controller.createAccount); // Create user account
app.put("/users/account/:id", User_Account_Controller.updateUser); // Update user
app.delete("/users/account/:id", User_Account_Controller.deleteUser); // Delete user
app.get("/users/forgotpassword/:user_email", User_Account_Controller.userforgotpassword); // Forgot password

app.post("/admin/account/login", Admin_Account_Controller.adminlogin);
app.get("/admin/account", Admin_Account_Controller.getAllUsers); // Get all user
app.get("/admin/account/:id", Admin_Account_Controller.getUserById); // Get specific user
app.post("/admin/account/create", Admin_Account_Controller.AdmincreateAccount); // Create Admin Account
app.put("/admin/account/:id", Admin_Account_Controller.AdminupdateUser); // Update Account
app.delete("/admin/account/:id", Admin_Account_Controller.AdmindeleteUser); // Delete Account 
app.get("/admin/forgotpassword/:user_email", Admin_Account_Controller.adminforgotpassword);

app.get("/account/profile/:id", Profile_Controller.getUserProfile);
app.put("/account/profile/:id", Profile_Controller.updateUserProfile);



app.get("/users/accountselection", (req,res) => {
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


app.get("/admin/viewUser", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "allUsers.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
})

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

app.get("/admin/viewUser", (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "allUsers.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
})


app.get("/profile/:id", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "profile.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});


//Industry Routes
app.get("/users/industry/:id", industry_info_controller.getIndustryInfo);//Get Industry data

app.get("/admin/industry", industry_info_controller.displayAdminPage); // Dispaly Admin Page

app.get("/admin/api/industry", industry_info_controller.getAllIndustryInfo); // Get All challenges

app.post("/admin/industry", validateIndustryAndQuiz.validateAddChallenge, industry_info_controller.createNewChallenge); // Create new challenge

app.put("/admin/industry/challenge", validateIndustryAndQuiz.validateSaveChallenge, industry_info_controller.updateChallenge); // Update Challenge

app.put("/admin/industry/intro", validateIndustryAndQuiz.validateSaveIntro, industry_info_controller.updateIndustryInfo); // Update Industry Introduction

app.delete("/admin/industry/:id",industry_info_controller.deleteIndustryChallenge); // Delete Challenge

//Quiz Routes
app.get("/users/quiz/checkAnswers", quiz_controller.checkAnswers); //Check Answers and return result

app.get("/users/quiz/:id", quiz_controller.get15Questions); // Get and show questions

app.get("/admin/quiz", quiz_controller.displayAdminPage); //Dispaly Admin Page

app.get("/admin/api/quiz", quiz_controller.getAllQuestions); //Get all questions

app.put("/admin/quiz/update", validateIndustryAndQuiz.validateUpdateQuestion, quiz_controller.updateQuestion); // Update a question's details

app.post("/admin/quiz/create", validateIndustryAndQuiz.validateCreateQuestion,quiz_controller.createNewQuestion); // Make a new Question

app.delete("/admin/quiz/delete", validateIndustryAndQuiz.validateDeleteQuestion, quiz_controller.deleteQuestion); // Delete Question



app.get("/", async  (req,res) =>{
    try {
        // Connect to the database
        await sql.connect(dbConfig);
        
        // Create a new SQL request
        const request = new sql.Request();
        
        // Execute the SQL query
        const result = await request.query(`SELECT * FROM Test`);
        
        // Send the result as the response
        res.send(result.recordset);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the database connection
        sql.close();
    }
});


//Forum api
app.get('/posts', forumController.getAllPosts); //Getting all post
app.get("/forum", async (req,res) => {
    const filePath = path.join(__dirname, "public", "html", "forum.html");
    console.log("File path is", filePath);
    res.sendFile(filePath);
});
app.get('/posts/:header',forumController.getPostbyHeader); //Getting post by searching the header
app.post('/forum/post', forumController.createPost); // Route to handle creating a new post

//Comments api
app.get('/comments/:postId', commentsController.getCommentById); //Route to get comments
app.post('/comments', commentsController.createComment);// Post comments


//Feedback Routes
app.get("/admin/allfeedback", feedbackController.getAllFeedback); // admin getting every feedback
app.post("/users/feedback", feedbackController.createFeedback); // users post feedbacks

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