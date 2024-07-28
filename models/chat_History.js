const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ChatHistory {
    constructor(chatHistoryId, role, text, timeStamp, conversationId) {
      this.chatHistoryId = chatHistoryId;
      this.role = role;
      this.text = text;
      this.timeStamp = timeStamp;
      this.conversationId = conversationId;
    }

    //Get the preious dialogs from a chat
    static async fetchChatHistory(conversationId) {
        let connection;

        try {
            connection = await sql.connect(dbConfig);
            
            const sqlQuery = `
                SELECT role, text, chatHistoryId, timeStamp, conversationId
                FROM ChatHistory
                WHERE conversationId = @conversationId
                ORDER BY timeStamp ASC;
            `;

            const request = connection.request();
            request.input("conversationId", sql.Int, conversationId);
            const result = await request.query(sqlQuery);

            // Format the result to access and display it easier.
            const formattedHistory = result.recordset.map(row => ({
                role: row.role,
                data: [{ text: row.text }]
            }));

            // Optionally, you can also fetch the full chat history as objects if needed
            const chatHistory = result.recordset.map(record =>
                new ChatHistory(
                    record.chatHistoryId,
                    record.role,
                    record.text.replace(/\n/g, '<br>'),
                    record.timeStamp,
                    record.conversationId
                )
            );

            return { formattedHistory, chatHistory };
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw Error("Database Error");
        } finally {
            // Ensure the connection is closed
            if (connection) {
                await connection.close();
            }
        }
    }


    // Add new history
    static async addChatHistory(role, text, conversationId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig); 
            const sqlQuery = `
                INSERT INTO ChatHistory (role, text, timeStamp, conversationId)
                VALUES (@role, @text, GETDATE(), @conversationId);
            `;

            const request = connection.request();
            request.input("role", sql.NVarChar(5), role);
            request.input("text", sql.NVarChar(sql.MAX), text);
            request.input("conversationId", sql.Int, conversationId);
            const result = await request.query(sqlQuery);

            return true;
        } catch (error) {
            console.error('Error adding chat history:', error);
            throw Error("Database Error");
        } finally {
            // Ensure the connection is closed
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = ChatHistory;