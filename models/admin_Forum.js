//Done by Joseph
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Admin_Forum{
  constructor(post_id, date_column, header, message ){
      this.post_id = post_id;
      this.date_column = date_column;
      this.header = header;
      this.message = message;
  }

  static async getAllPosts() {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Posts ORDER BY post_id DESC, date_column DESC;`; // Replace with your actual table name
  
      const request = connection.request();
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset.map(
        (row) => new Admin_Forum(row.post_id, row.date_column, row.header, row.message)
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
        ? new Admin_Forum(
            result.recordset[0].post_id,
            result.recordset[0].date_column,
            result.recordset[0].header,
            result.recordset[0].message
          )
        : null;
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

module.exports = Admin_Forum;