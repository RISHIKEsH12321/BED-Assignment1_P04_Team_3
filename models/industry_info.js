const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Industry_Info{
    constructor(industru_id, industry_name, introduction, ) {
        this.industru_id = industru_id;
        this.industry_name = industry_name;
        this.introduction = introduction;
    }

    
    static async getAllIndustryInfo() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Industry_Info;`;
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset;
    }


    static async getIndustryInfo(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Industry_Info WHERE industry_id = @id;`;
    
        const request = connection.request();
        request.input("id",id)
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset[0];
    }

    static async updateIndustryInfo(id, introduction) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
        UPDATE Industry_Info SET 
        introduction = @introduction
        WHERE
        industry_id = @id;
        `;
    
        const request = connection.request();
        request.input("introduction", introduction);
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected;
    }
}
module.exports = Industry_Info;