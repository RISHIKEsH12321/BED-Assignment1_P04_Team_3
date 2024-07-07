const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyparser=require("body-parser")
const path = require('path');
const fs = require("fs");

const usercontroller = require("./controllers/usercontroller")
const booksController = require("./controllers/booksControlelr")

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/loginPage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html","login.html"));
});
// { 
//   "username":"TestUser", 
//   "password": "123",
//   "role":"member"
// }
// {
//   "username": "john_doe1",
//   "passwordHash": "examplePassword123",
//   "role": "librarian"
// }

app.get("/booksPage", (req,res) => {
  res.sendFile(path.join(__dirname, "public", "html","books.html"));
});
app.get("/registerPage", (req,res) => {
  res.sendFile(path.join(__dirname, "public", "html","register.html"));
});

app.post("/register", usercontroller.registerUser);
app.post("/login", usercontroller.login);

app.get("/books", booksController.getAllBooks);
app.put("/books/:bookId/availability", booksController.updateBookAvalibility);
app.get("/books/:id", booksController.getBookById)


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