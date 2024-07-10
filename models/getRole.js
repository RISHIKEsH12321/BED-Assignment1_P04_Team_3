const dbConfig = require("../dbConfig");
const sql = require("mssql");

class Role{
    constructor(adminId, userId, userame, role){
        this.adminId = adminId;
        this.userId = userId;
        this.userame = userame;
        this.role = role;
    }

    static async getUserRole(userId, adminId){
        try{
            const connection = await sql.connect(dbConfig);
    
            const sqlQuery = `SELECT user_role FROM User_Account WHERE user_id = @user_id;`;
        
            const request = connection.request();
            request.input("user_id",userId);
            const result = await request.query(sqlQuery);
            const userTableRole = result.recordset[0].user_role;

            console.log("IS RUN");

            if (userTableRole === "admin"){
                const sqlQueryAdminTable = `SELECT user_role FROM Admin_Account WHERE user_id = @user_id AND admin_id = @admin_id;`;            
                const request = connection.request();
                request.input("user_id",userId);
                request.input("admin_id",adminId);
                const result = await request.query(sqlQuery);
                console.log("Secont Check: "+ result.recordset[0].user_role);
                const adminTableRole = result.recordset[0].user_role;
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