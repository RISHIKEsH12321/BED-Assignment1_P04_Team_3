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
            return result.recordset[0];
        } else {
            // not login
            return null;
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


    static async AdmincreateAccount(newUserData, securityCode) {
        const connection = await sql.connect(dbConfig);
    
        try {
            // Check if the security code exists and user_id is NULL
            const checkCodeQuery = `
                SELECT code_id FROM Codes 
                WHERE security_code = @security_code AND user_id IS NULL`;
            
            const checkRequest = connection.request();
            checkRequest.input("security_code", securityCode);
            const checkResult = await checkRequest.query(checkCodeQuery);
    
            if (checkResult.recordset.length === 0) {
                throw new Error("Invalid security code or already used.");
            }
    
            // Insert into User_Account
            const insertUserQuery = `
                INSERT INTO User_Account (username, user_email, user_phonenumber, user_password, user_role) 
                VALUES (@username, @user_email, @user_phonenumber, @user_password, @user_role); 
                SELECT SCOPE_IDENTITY() AS user_id;`;
        
            const insertRequest = connection.request();
            insertRequest.input("username", newUserData.username);
            insertRequest.input("user_email", newUserData.user_email);
            insertRequest.input("user_phonenumber", newUserData.user_phonenumber);
            insertRequest.input("user_password", newUserData.user_password);
            insertRequest.input("user_role", newUserData.user_role || 'admin');
            const insertResult = await insertRequest.query(insertUserQuery);
    
            const userId = insertResult.recordset[0].user_id;
    
            // Update Codes table with user_id
            const updateCodeQuery = `
                UPDATE Codes
                SET user_id = @user_id
                WHERE security_code = @security_code`;
            
            const updateRequest = connection.request();
            updateRequest.input("user_id", userId);
            updateRequest.input("security_code", securityCode);
            await updateRequest.query(updateCodeQuery);
    
            // Insert into Admin_Account
            const insertAdminQuery = `
                INSERT INTO Admin_Account (user_id, username, user_email, user_phonenumber, user_password, user_role) 
                VALUES (@user_id, @username, @user_email, @user_phonenumber, @user_password, @user_role);
                SELECT SCOPE_IDENTITY() AS admin_id`;
            
            const adminRequest = connection.request();
            adminRequest.input("user_id", userId);
            adminRequest.input("username", newUserData.username);
            adminRequest.input("user_email", newUserData.user_email);
            adminRequest.input("user_phonenumber", newUserData.user_phonenumber);
            adminRequest.input("user_password", newUserData.user_password);
            adminRequest.input("user_role", newUserData.user_role || 'admin');
            const adminResult = await adminRequest.query(insertAdminQuery);
    
            // Insert into Profile (assuming this step is necessary)
    
            const profileQuery = `
                INSERT INTO Profile (user_id, security_code) 
                VALUES (@user_id, @security_code); 
                SELECT SCOPE_IDENTITY() AS profile_id`;
            
            const profileRequest = connection.request();
            profileRequest.input("user_id", userId);
            profileRequest.input("security_code", securityCode);
            await profileRequest.query(profileQuery);
    
            // Close connection
            connection.close();
    
            // Return the newly created user
            return this.getUserById(userId);
        } catch (error) {
            console.error("Error creating user:", error.message);
            connection.close();
            throw error;
        }
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


    static async adminforgotpassword(user_email){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Admin_Account WHERE user_email = @user_email`;

        const request = connection.request();
        request.input('user_email', user_email);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
          ? new Admin_Account(
              result.recordset[0].admin_id,
              result.recordset[0].user_id,
              result.recordset[0].username,
              result.recordset[0].user_email,
              result.recordset[0].user_phonenumber,
              result.recordset[0].user_password,
              result.recordset[0].user_role
            )
        : null;
    }

}

module.exports = Admin_Account;