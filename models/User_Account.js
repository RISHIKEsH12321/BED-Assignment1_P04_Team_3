const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User_Account {
    constructor(user_id, username, user_email, user_phonenumber, user_password, user_role){
        this.user_id = user_id;
        this.username = username;
        this.user_email = user_email;
        this.user_phonenumber = user_phonenumber;
        this.user_password = user_password;
        this.user_role = user_role;
    }

    static async userlogin(username, user_password){
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `SELECT * FROM User_Account WHERE username = @username AND user_password = @user_password`; // Replace with your actual table name
        const request = connection.request();

        request.input('username', sql.VarChar, username);
        request.input('user_password', sql.VarChar, user_password);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length > 0) {
            // login 
            return true;
        } else {
            // not login
            return false;
        }
    }   


    static async getUserById(user_id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM User_Account WHERE user_id = @user_id`; // Parameterized query
    
        const request = connection.request();
        request.input("user_id", user_id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset[0]
          ? new User_Account(
              result.recordset[0].user_id,
              result.recordset[0].username,
              result.recordset[0].user_email,
              result.recordset[0].user_phonenumber,
              result.recordset[0].user_password,
              result.recordset[0].user_role
            )
          : null; // Handle book not found
    }


    static async createAccount(newUserData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO User_Account (username, user_email, user_phonenumber, user_password, user_role) 
                            VALUES (@username, @user_email, @user_phonenumber, @user_password, @user_role); 
                            SELECT SCOPE_IDENTITY() AS user_id;`;
    
        const request = connection.request();
        request.input("username",newUserData.username);
        request.input("user_email",newUserData.user_email);
        request.input("user_phonenumber",newUserData.user_phonenumber);
        request.input("user_password",newUserData.user_password);
        request.input("user_role",newUserData.user_role || 'user'); // Default 'user'
    
        const result = await request.query(sqlQuery);
    
        connection.close();

        return this.getUserById(result.recordset[0].user_id);
    }


    static async updateUser(user_id, newUserData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `UPDATE User_Account SET username = @username, user_email = @user_email, user_phonenumber = @user_phonenumber, 
                            user_password = @user_password WHERE user_id = @user_id`; // Parameterized query
    
        const request = connection.request();
        request.input("user_id",user_id);
        request.input("username", newUserData.username);
        request.input("user_email", newUserData.user_email);
        request.input("user_phonenumber", newUserData.user_phonenumber);
        request.input("user_password", newUserData.user_password);
        request.input("user_role", newUserData.user_role);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getUserById(user_id);
    }


    static async deleteUser(user_id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM User_Account WHERE user_id = @user_id`; // Parameterized query
    
        const request = connection.request();
        request.input("user_id", user_id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected > 0; // Indicate success based on affected rows
    }
}

module.exports = User_Account;