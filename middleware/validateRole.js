const dbConfig = require("../dbConfig");
const sql = require("mssql");
const getRole = require("../models/getRole");
const jwt = require('jsonwebtoken');

const validateUserRole = async (req, res) =>{
    const {user_id, admin_id, token} = req.body;

    try{
        const role = await getRole.getUserRole(user_id, admin_id, token);
        // console.log(role)
        return role;
    } catch (error) {
        console.error("Login Error: ", error);
        res.json({ message: "Internal server error" });
    }
}


const validateRoleUsingToken = async (req,res) => {
    const {token} = req.body;

    try{
        const role = await getRole.getRoleByToken(token);

        return role;
    } catch (error){
        console.error("Login Error: ", error);
        res.json({message: "Internal server error"})
    }
}


module.exports = {
    validateUserRole,
    validateRoleUsingToken
}