const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Industry_Challenges{
    constructor(id, industry_id, name, description, content) {
        this.id = id;
        this.industry_id = industry_id;
        this.name = name;
        this.description = description;
        this.content = content;
    }

    static async getAllIndustryChallenges() {
        let connection; // Define connection variable outside the try block
        try {
            connection = await sql.connect(dbConfig); // Establish connection
    
            const sqlQuery = `SELECT * FROM Industry_Challenges`;
    
            const request = connection.request(); // Create request object
    
            const result = await request.query(sqlQuery); // Execute query
    
            return result.recordsets; // Return the result
        } catch (err) {
            // Optional: Log the error if needed
            throw err; // Rethrow error to be handled by the caller
        } finally {
            if (connection) {
                try {
                    await connection.close(); // Attempt to close connection
                } catch (closeErr) {
                    console.log('Error closing the connection:', closeErr); // Log error if closing fails
                }
            }
        }
    }
    
    static async getIndustryChallenges(id) {
        let connection; // Define connection variable outside the try block
        try {
            connection = await sql.connect(dbConfig); // Establish connection
    
            const sqlQuery = `SELECT * FROM Industry_Challenges WHERE industry_id = @id`;
    
            const request = connection.request(); // Create request object
            request.input("id", id); // Add input parameter
    
            const result = await request.query(sqlQuery); // Execute query
    
            return result.recordsets; // Return the result
        } catch (err) {
            console.log('Error executing query:', err); // Log error if needed
            throw err; // Rethrow error to be handled by the caller
        } finally {
            if (connection) {
                try {
                    await connection.close(); // Attempt to close connection
                } catch (closeErr) {
                    console.log('Error closing the connection:', closeErr); // Log error if closing fails
                }
            }
        }
    }
    

    static async createNewChallenge(newChallenge) {
        let connection;
        try {
            connection = await sql.connect(dbConfig); // Establish connection
    
            const sqlQuery = `INSERT INTO Industry_Challenges (industry_id, challenge_name, challenge_description, challenge_content) VALUES (@id, @name, @description, @content)`;
    
            const request = connection.request(); // Create request object
            request.input("id", newChallenge.id);
            request.input("name", newChallenge.name);
            request.input("description", newChallenge.description);
            request.input("content", newChallenge.content);
            const result = await request.query(sqlQuery); // Execute query
    
            return result.rowsAffected; // Return the result
        } catch (err) {
            console.log('Error executing query:', err); // Log error
            throw err; // Rethrow error to be handled by the caller
        } finally {
            if (connection) {
                try {
                    await connection.close(); // Attempt to close connection
                } catch (closeErr) {
                    console.log('Error closing the connection:', closeErr); // Log error if closing fails
                }
            }
        }
    }
     

    static async updateChallenge(newChallenge) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
    
            const sqlQuery = `UPDATE Industry_Challenges SET challenge_name = @name, challenge_description = @description, challenge_content = @content WHERE challenge_id = @challenge_id;`;
    
            const request = connection.request();
            request.input("name", newChallenge.challenge_name);
            request.input("description", newChallenge.challenge_description);
            request.input("content", newChallenge.challenge_content);
            request.input("challenge_id", newChallenge.challenge_id); 
            const result = await request.query(sqlQuery);
    
            // Example request body
            // {
            //     "challenge_id": 10,
            //     "challenge_name": "PUT challenge Test",
            //     "challenge_description": "PUT challenge Test",
            //     "challenge_content": "PUT challenge Test"
            // }
    
            return result.rowsAffected; 
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            // Ensure connection is closed
            if (connection) {
                await connection.close();
            }
        }
    }
      

    static async deleteIndustryChallenge(id) {
        try{
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Industry_Challenges WHERE challenge_id = @id`;
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected; 
        }catch (err){
            console.log(err);
            throw err;
        }
    }    


}

module.exports = Industry_Challenges;