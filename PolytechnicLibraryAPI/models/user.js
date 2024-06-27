const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("../dbConfig");

class User{
    constructor(id, username, email, role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    static async createUser(newUserData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO Users (username, email, role) VALUES (@username, @email, @role); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record
    
        const request = connection.request();
        request.input("username", newUserData.username);
        request.input("email", newUserData.email);
        request.input("role", newUserData.role);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        // Retrieve the newly created user using its ID
        return this.getUserById(result.recordset[0].id);
    }

    static async getAllUsers() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Users`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new User(row.id, row.username, row.email)
        ); // Convert rows to User objects
    }

    static async getUserById(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Users WHERE id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset[0]
          ? new User(
              result.recordset[0].id,
              result.recordset[0].username,
              result.recordset[0].email
            )
          : null; // Handle user not found
    }

    

    static async updateUser(id, newUserData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `UPDATE Users SET username = @username, email = @email WHERE id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        request.input("username", newUserData.username || null); // Handle optional fields
        request.input("email", newUserData.email || null);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getUserById(id); // returning the updated user data
    }

    static async deleteUser(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Users WHERE id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected > 0; // Indicate success based on affected rows
    }

    static async searchUsers(searchTerm) {
      console.log("Called searchUsers in user.js");
      const connection = await sql.connect(dbConfig);
  
      try {
        const query = `
          SELECT *
          FROM Users
          WHERE username LIKE '%${searchTerm}%'
            OR email LIKE '%${searchTerm}%'
        `;
  
        const result = await connection.request().query(query);
        return result.recordset;
      } catch (error) {
        throw new Error("Error searching users"); // Or handle error differently
      } finally {
        await connection.close(); // Close connection even on errors
      }
    }

    static async getUsersWithBooks() {
      const connection = await sql.connect(dbConfig);
  
      try {
        const query = `
          SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
          FROM Users u
          LEFT JOIN UserBooks ub ON ub.user_id = u.id
          LEFT JOIN Books b ON ub.book_id = b.id
          ORDER BY u.username;
        `;
  
        const result = await connection.request().query(query);
  
        // Group users and their books
        const usersWithBooks = {};
        for (const row of result.recordset) {
          const userId = row.user_id;
          if (!usersWithBooks[userId]) {
            usersWithBooks[userId] = {
              id: userId,
              username: row.username,
              email: row.email,
              books: [],
            };
          }
          usersWithBooks[userId].books.push({
            id: row.book_id,
            title: row.title,
            author: row.author,
          });
        }
  
        return Object.values(usersWithBooks);
      } catch (error) {
        throw new Error("Error fetching users with books");
      } finally {
        await connection.close();
      }
    }
}

module.exports = User;
