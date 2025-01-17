//Done by Joseph
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Post{
    constructor(post_id, date_column, header, message, author ){
        this.post_id = post_id;
        this.date_column = date_column;
        this.header = header;
        this.message = message;
        this.author = author;
    }

    static async getPostbyHeader(postHeader) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Posts WHERE header LIKE @header ORDER BY post_id DESC, date_column DESC;`; // Parameterized query
  
      const request = connection.request();
      request.input("header", `${postHeader}%`);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset.map(
        (row) => new Post(row.post_id, row.date_column, row.header, row.message, row.author)
      ); // Convert rows to post objects
  }

  static async getPostById(post_id){
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Posts WHERE post_id = @post_id`; 

    const request = connection.request();
    request.input("post_id", post_id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Post(
          result.recordset[0].post_id,
          result.recordset[0].date_column,
          result.recordset[0].header,
          result.recordset[0].message,
          result.recordset[0].author
        )
      : null;
  }

  static async getAllPosts() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `Select * from Posts ORDER BY post_id DESC, date_column DESC;`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Post(row.post_id, row.date_column, row.header, row.message, row.author)
    ); // Convert rows to post objects
  } 

  static async createPost(header, message, author) {
    try {
      await sql.connect(dbConfig);
      const request = new sql.Request();
      const query = `INSERT INTO Posts (date_column, Header, Message, Author) VALUES (CONVERT(DATE, GETDATE()),@header, @message, @author)`;
      request.input('header', sql.NVarChar, header);
      request.input('message', sql.NVarChar, message);
      request.input('author', author);
      const result = await request.query(query);
      // console.log("Result from SQL query:", result);
      await sql.close();
      return result;
    } catch (err) {
      throw new Error(`Error creating post: ${err.message}`);
    } 
  }
    
  static async updatePost(post_id, header, message) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `UPDATE Posts SET header = @header, message = @message WHERE post_id = @post_id`; // Parameterized query
  
      const request = connection.request();
      request.input("post_id", post_id);
      request.input("header", header || null); // Handle optional fields
      request.input("message", message || null);
  
      await request.query(sqlQuery);

      connection.close();
  
      return this.getPostById(post_id); // returning the updated post data
  }

  static async deletePost(id) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `DELETE FROM Comments WHERE post_id =@id;
                        DELETE FROM Posts WHERE post_id = @id`; // Parameterized query
  
      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Post;