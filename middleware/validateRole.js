const dbConfig = require("../dbConfig");
const sql = require("mssql");
const getRole = require("../models/getRole");

const validateUserRole = async (req, res) =>{
    const {user_id, admin_id} = req.body;
    try{
        const role = await getRole.getUserRole(user_id, admin_id);
        console.log(role)
        return role;
    } catch (error) {
        console.error("Login Error: ", error);
        res.json({ message: "Internal server error" });
    }
}


module.exports = {
    validateUserRole
}