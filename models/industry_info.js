const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Industry_Info {
    constructor(industry_id, industry_name, introduction) {
        this.industry_id = industry_id;
        this.industry_name = industry_name;
        this.introduction = introduction;
    }

    static async getAllIndustryInfo() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM Industry_Info;`;
            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset;
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            // Ensure the connection is closed
            if (connection) {
                await connection.close();
            }
        }
    }

    static async getIndustryInfo(id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM Industry_Info WHERE industry_id = @id;`;
            const request = connection.request();
            request.input("id", id);
            const result = await request.query(sqlQuery);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            // Ensure the connection is closed
            if (connection) {
                await connection.close();
            }
        }
    }

    static async updateIndustryInfo(id, introduction) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `UPDATE Industry_Info SET introduction = @introduction WHERE industry_id = @id;`;
            const request = connection.request();
            request.input("introduction", introduction);
            request.input("id", id);
            const result = await request.query(sqlQuery);
            return result.rowsAffected;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            // Ensure the connection is closed
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = Industry_Info;
