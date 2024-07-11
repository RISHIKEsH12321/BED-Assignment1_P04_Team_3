const dbConfig = require("../dbConfig");
const sql = require("mssql");
const jwt = require('jsonwebtoken');

class Role{
    constructor(adminId, userId, userame, role){
        this.adminId = adminId;
        this.userId = userId;
        this.userame = userame;
        this.role = role;
    }

    static async getUserRole(userId, adminId, token){
        try{

            const decoded = jwt.verify(token, process.env.JWT_SECERT);
            console.log(decoded); // Access the user role
            console.log(`UserID: ${userId}`);
            console.log(`AdminId: ${adminId}`);
            if (!(decoded)){
                return "Invalid Token"
            }
            if (!(Number(userId) === Number(decoded.user_id))){
                return "Invalid User Account"
            }

            if (!(Number(adminId) === Number(decoded.admin_id))){
                return "Invalid Admin Account"
            }
            const connection = await sql.connect(dbConfig);
    
            const sqlQuery = `SELECT user_role FROM User_Account WHERE user_id = @user_id;`;
        
            const request = connection.request();
            request.input("user_id",userId);
            const result = await request.query(sqlQuery);
            const userTableRole = result.recordset[0].user_role;

            if (userTableRole === "admin"){
                const sqlQueryAdminTable = `SELECT user_role FROM Admin_Account WHERE user_id = @user_id AND admin_id = @admin_id;`;            
                const request = connection.request();
                request.input("user_id",userId);
                request.input("admin_id",adminId);
                const result = await request.query(sqlQuery);
                console.log("Secont Check: "+ result.recordset[0].user_role);
                const adminTableRole = result.recordset[0].user_role;
                return adminTableRole;
            }

            connection.close();
            
            return result.recordset[0].user_role;
        }catch (err){
            console.log(err);
            throw err;
        }
    }

}

module.exports = Role;