const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Admin_Account {
    constructor(admin_id, user_id, username, user_email, user_phonenumber, user_password, user_role){
        this.admin_id = admin_id
        this.user_id = user_id;
        this.username = username;
        this.user_email = user_email;
        this.user_phonenumber = user_phonenumber;
        this.user_password = user_password;
        this.user_role = user_role;
    };


    static async adminlogin(username, user_password){
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `SELECT * FROM Admin_Account WHERE username = @username AND user_password = @user_password`; // Replace with your actual table name
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


    static async getAllUsers() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM User_Account`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Admin_Account(row.admin_id, row.user_id, row.username, row.user_email, row.user_phonenumber, row.user_password, row.user_role)
        ); // Convert rows to Book objects
    }


    static async getUserById(user_id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM User_Account WHERE user_id = @user_id`; // Replace with your actual table name
    
        const request = connection.request();
        request.input('user_id', user_id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            return new Admin_Account(user.admin_id, user.user_id, user.username, user.user_email, user.user_phonenumber, user.user_password, user.user_role);
        } else {
            return null;
        }
    }


    static async AdmincreateAccount(newUserData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO User_Account (username, user_email, user_phonenumber, user_password, user_role) 
                            VALUES (@username, @user_email, @user_phonenumber, @user_password, @user_role); 
                            SELECT SCOPE_IDENTITY() AS user_id;`;
    
        const request = connection.request();
        request.input("username",newUserData.username);
        request.input("user_email",newUserData.user_email);
        request.input("user_phonenumber",newUserData.user_phonenumber);
        request.input("user_password",newUserData.user_password);
        request.input("user_role",newUserData.user_role || 'admin'); // Default 'admin'
    
        const result = await request.query(sqlQuery);

        const userId = result.recordset[0].user_id;

        const adminInsertQuery = `INSERT INTO Admin_Account (user_id, username, user_email, user_phonenumber, user_password, user_role) 
                                    VALUES (@user_id, @username, @user_email, @user_phonenumber, @user_password, @user_role);
                                    SELECT SCOPE_IDENTITY() AS admin_id`;

        const adminRequest = connection.request();
        adminRequest.input("user_id", userId);
        adminRequest.input("username", newUserData.username);
        adminRequest.input("user_email", newUserData.user_email);
        adminRequest.input("user_phonenumber", newUserData.user_phonenumber);
        adminRequest.input("user_password", newUserData.user_password);
        adminRequest.input("user_role", newUserData.user_role || 'admin');
        const admin_result = await adminRequest.query(adminInsertQuery)

        connection.close();
    
        return this.getUserById(admin_result.recordset[0].admin_id);
    }


    static async AdminupdateUser(user_id, newUserData) {
        const connection = await sql.connect(dbConfig);

        // Retrieve user's current role
        const userRoleQuery = `SELECT user_role FROM User_Account WHERE user_id = @user_id`;
        const roleRequest = connection.request();
        roleRequest.input("user_id", user_id);
        const { recordset: [{ user_role }] } = await roleRequest.query(userRoleQuery);
    
        // Update User_Account table
        const userUpdateQuery = `
            UPDATE User_Account 
            SET username = @username, user_email = @user_email, user_phonenumber = @user_phonenumber, 
                user_password = @user_password 
            WHERE user_id = @user_id`;
    
        const userRequest = connection.request();
        userRequest.input("user_id", user_id);
        userRequest.input("username", newUserData.username);
        userRequest.input("user_email", newUserData.user_email);
        userRequest.input("user_phonenumber", newUserData.user_phonenumber);
        userRequest.input("user_password", newUserData.user_password);
        await userRequest.query(userUpdateQuery);
    
        // If user role is 'admin', update Admin_Account table
        if (user_role === 'admin') {
            const adminUpdateQuery = `
                UPDATE Admin_Account 
                SET username = @username, user_email = @user_email, user_phonenumber = @user_phonenumber, 
                    user_password = @user_password 
                WHERE user_id = @user_id`;
    
            const adminRequest = connection.request();
            adminRequest.input("user_id", user_id);
            adminRequest.input("username", newUserData.username);
            adminRequest.input("user_email", newUserData.user_email);
            adminRequest.input("user_phonenumber", newUserData.user_phonenumber);
            adminRequest.input("user_password", newUserData.user_password);
            await adminRequest.query(adminUpdateQuery);
        }
    
        connection.close();
    
        return this.getUserById(user_id);
    }
    
    


    static async AdmindeleteUser(user_id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT user_role FROM User_Account WHERE user_id = @user_id`; // Parameterized query
    
        const request = connection.request();
        request.input("user_id", user_id);
        const result = await request.query(sqlQuery);

        if (result.recordset.length===0 || result.recordset[0].user_role === 'admin'){
            connection.close();
            return false;
        }
        
        const deleteQuery = `DELETE FROM User_Account WHERE user_id = @user_id`;
        const deleteRequest = connection.request();
        deleteRequest.input("user_id", user_id);
        const deleteResult = await deleteRequest.query(deleteQuery);

        connection.close();
    
        return result.rowsAffected > 0; // Indicate success based on affected rows
    }

}

module.exports = Admin_Account;