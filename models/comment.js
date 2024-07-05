const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comment{
    constructor(comment_id, author, date_column, message, post_id){
        this.comment_id = comment_id;
        this.author = author;
        this.date_column = date_column;
        this.message = message;
        this.post_id = post_id
    }

    static async getCommentById(post_id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Comments WHERE post_id = @post_id ORDER BY comment_id DESC, date_column DESC;`; // Parameterized query
    
        const request = connection.request();
        request.input("post_id", post_id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
            (row) => new Comment(row.comment_id, row.author, row.date_column, row.message,row.post_id)
          ); // Convert rows to comment objects
    }

    static async createComment(comment, post_id) {
        try {
          await sql.connect(dbConfig);
          const request = new sql.Request();
          const query = `INSERT INTO Comments (date_column, message, post_id) VALUES (CONVERT(DATE, GETDATE()), @message, @post_id)`;
          request.input('message', sql.NVarChar, comment);
          request.input('post_id', post_id);
          const result = await request.query(query);
          return result;
        } catch (err) {
          throw new Error(`Error creating comment: ${err.message}`);
        } finally {
          sql.close();
        }
    }
}

module.exports = Comment;