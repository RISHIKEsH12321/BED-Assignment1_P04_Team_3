const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Chat{
    constructor(conversationId, conversationTitle, timeStamp, userId) {
        this.conversationId = conversationId;
        this.conversationTitle = conversationTitle;
        this.timeStamp = timeStamp
        this.userId = userId;
    }

    static async fetchChatByUserId(userId){
        let connection;
    
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT *
                FROM Chat
                WHERE userId = @userId
                ORDER BY timeStamp DESC;
            `;
    
            const request = connection.request();
            request.input("userId", sql.Int, userId);
            const result = await request.query(sqlQuery);
    
            const chatConversations = result.recordset.map(record =>
                new Chat(
                    record.conversationId,
                    record.conversationTitle,
                    record.timeStamp,
                    record.userId
                )
            );
    
            return chatConversations;
        } catch (error) {
            console.error('Error fetching and formatting chat conversations by userId:', error);
            throw error; // Ensure errors are thrown
        } finally {
            if (connection) {
                try {
                    console.log(123);
                    await connection.close();
                } catch (closeError) {
                    console.error('Error closing the connection:', closeError);
                }
            }
        }
    }

    static async deleteChat(conversationId){
        let connection;
    
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `
                DELETE FROM Chat WHERE conversationId = @conversationId
            `;
    
            const request = connection.request();
            request.input("conversationId", sql.Int, conversationId);
            const result = await request.query(sqlQuery);
    
            // Check the number of rows affected
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error deleting chat conversation by conversationId:', error);
        } finally {
            // Ensure the connection is closed even if an error occurs
            if (connection) {
                try {
                    await connection.close();
                } catch (closeError) {
                    console.error('Error closing the connection:', closeError);
                }
            }
        }
    }

    static async addNewChat(conversationTitle, userId) {
        let connection;
    
        try {
            connection = await sql.connect(dbConfig);
            const insertQuery = `
                INSERT INTO Chat (conversationTitle, timeStamp, userId)
                OUTPUT INSERTED.conversationId, INSERTED.conversationTitle, INSERTED.timeStamp, INSERTED.userId
                VALUES (@conversationTitle, GETDATE(), @userId);
            `;
    
            const request = connection.request();
            request.input("conversationTitle", sql.NVarChar(sql.MAX), conversationTitle);
            request.input("userId", sql.Int, userId);
            const result = await request.query(insertQuery);
    
            if (result.recordset.length > 0) {
                // Create an instance of ChatConversation
                const { conversationId, conversationTitle, timeStamp, userId } = result.recordset[0];
                return new Chat(conversationId, conversationTitle, timeStamp, userId);
            } else {
                console.log("Error creating chat conversation: No record returned");
            }
        } catch (error) {
            // Check if the error is related to a foreign key constraint violation
            if (error.message.includes("The INSERT statement conflicted with the FOREIGN KEY constraint")) {
                console.error('Foreign key constraint error:', error);
            } else {
                console.error('Error creating chat conversation:', error);
            }
        } finally {
            // Ensure the connection is closed even if an error occurs
            if (connection) {
                try {
                    await connection.close();
                } catch (closeError) {
                    console.error('Error closing the connection:', closeError);
                }
            }
        }
    }    

    static async editChatTitle(conversationTitle, conversationId){
        let connection;
    
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `
                UPDATE Chat
                SET conversationTitle = @conversationTitle
                WHERE conversationId = @conversationId
            `;
    
            const request = connection.request();
            request.input("conversationTitle", sql.NVarChar(sql.MAX), conversationTitle);
            request.input("conversationId", sql.Int, conversationId);
            const result = await request.query(sqlQuery);
    
            
            // Check the number of rows affected
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error updating conversation title by conversationId:', error);
            return false;
        } finally {
            // Ensure the connection is closed even if an error occurs
            if (connection) {
                try {
                    await connection.close();
                } catch (closeError) {
                    console.error('Error closing the connection:', closeError);
                }
            }
        }
    }
}

module.exports = Chat;