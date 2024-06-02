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
    static async getIndustryChallenges(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Industry_Challenges WHERE industry_id = @id`;
    
        const request = connection.request();
        request.input("id", id);

        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordsets;
    }

    static async createNewChallenge(newChallenge) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO Industry_Challenges (industry_id, challenge_name, challenge_description, challenge_content)
        VALUES 
        (@id, @name, @description, @content)
        `;
    
        const request = connection.request();
        request.input("id", newChallenge.id);
        request.input("name", newChallenge.name);
        request.input("description", newChallenge.description);
        request.input("content", newChallenge.content);
        const result = await request.query(sqlQuery);

        //Example req body
        // {
        //     "id":3,
        //     "name": "POST challenge Test",
        //     "description": "POST challenge Test",
        //     "content": "POST challenge Test"
        // }
    
        connection.close();
    
        return result.rowsAffected; 
    }    

    static async updateChallenge(newChallenge) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
        UPDATE Industry_Challenges SET 
        challenge_name = @name,
        challenge_description = @description,
        challenge_content = @content
        WHERE challenge_id = @challenge_id; 
        `;
    
        const request = connection.request();
        request.input("name", newChallenge.challenge_name);
        request.input("description", newChallenge.challenge_description);
        request.input("content", newChallenge.challenge_content);
        request.input("challenge_id", newChallenge.challenge_id); 
        const result = await request.query(sqlQuery);

        //Exmaple request body
        // {
        //     "challenge_id": 10,
        //     "challenge_name": "PUT challenge Test",
        //     "challenge_description": "PUT challenge Test",
        //     "challenge_content": "PUT challenge Test"
        // }
    
        connection.close();
    
        return result.rowsAffected; 
    }    

    static async deleteIndustryChallenge(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Industry_Challenges WHERE challenge_id = @id`;
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected; 
    }    


}

module.exports = Industry_Challenges;