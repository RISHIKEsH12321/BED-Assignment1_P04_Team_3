const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Post{
    constructor(post_id, date_column, header, message ){
        this.post_id = post_id;
        this.date_column = date_column;
        this.header = header;
        this.message = message;
    }

    static async getAllPosts() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Posts`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Post(row.post_id, row.date_column, row.header, row.message)
        ); // Convert rows to post objects
    }

    static async createPost(newPostData) {
        try {
            // Connect to the MSSQL database
            const connection = await sql.connect(dbConfig);
    
            // SQL query to insert new post into the Posts table
            const sqlQuery = `
                INSERT INTO Posts (date_column, header, message)
                VALUES (GETDATE(), @header, @message);
                SELECT SCOPE_IDENTITY() AS post_id;
            `;
    
            // Create a new request object
            const request = connection.request();
    
            // Add parameters for header and message
            request.input('header', sql.NVarChar(50), newPostData.header);
            request.input('message', sql.NVarChar(300), newPostData.message);
    
            // Execute the SQL query
            const result = await request.query(sqlQuery);
    
            // Get the newly created post ID
            const postId = result.recordset[0].post_id;
    
            // Close the database connection
            await connection.close();
    
            // Respond with the newly created post
            res.status(201).json({ post_id: postId });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).send('Error creating post');
        }
    }

    static async updatePost(id, newPostData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `UPDATE Posts SET header = @header, message = @message WHERE post_id = @post_id`; // Parameterized query
    
        const request = connection.request();
        request.input("post_id", post_id);
        request.input("header", newPostData.header || null); // Handle optional fields
        request.input("message", newPostData.message || null);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getBookById(id); // returning the updated book data
    }

    static async deletePost(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Posts WHERE id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected > 0; // Indicate success based on affected rows
    }
}

class Comment{
    constructor(id, author, date, message){
        this.id = id;
        this.author = author;
        this.date = date;
        this.message = message;
    }

    static async getCommentById(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Comments WHERE id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
            (row) => new Comment(row.id, row.author, row.date, row.message)
          ); // Convert rows to post objects
      }
}

module.exports = Post;
module.exports = Comment;