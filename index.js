const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom"); 

//Controllers
const industry_info_controller = require("./controller/industry_info_controller");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

app.use("/",express.static("public")); //Static Files start from public 
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

app.get("/users/industry/:id",industry_info_controller.getIndustryInfo);//Get Industry data

app.post("/admin/industry",industry_info_controller.createNewChallenge); // Create new challenge

app.put("/admin/industry",industry_info_controller.updateChallenge); // Update Challenge

app.put("/admin/industry/:id", industry_info_controller.updateIndustryInfo); // Update Industry Introduction

app.delete("/admin/industry/:id",industry_info_controller.deleteIndustryChallenge); // Delete Challenge



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