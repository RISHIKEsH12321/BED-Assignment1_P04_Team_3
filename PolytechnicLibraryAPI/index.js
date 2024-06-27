const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyparser=require("body-parser")

const usercontroller = require("./controllers/usercontroller")
const booksController = require("./controllers/booksControlelr")
const Users = require("./models//user");
const User = require("./models//user");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port
app.use(bodyparser.json())

app.post('/register', usercontroller.registerUser)

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