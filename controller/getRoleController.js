const Role = require("../models/getRole");
const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUserRole = async(req,res) => {
    const { user_id, admin_id, token } = req.body;

    try {
        const userRole = await Role.getUserRole(user_id, admin_id, token);
        res.json({ userRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {getUserRole};