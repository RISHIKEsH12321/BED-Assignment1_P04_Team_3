const Admin_Account = require("../models/Admin_Account");
const path = require("path");

const fs = require("fs");
const { JSDOM } = require("jsdom"); 

const adminlogin = async (req,res) => {
    const { username, user_password } = req.body;

    try {
        // Call the userlogin method from the model
        const isLoggedIn = await Admin_Account.adminlogin(username, user_password);

        if (isLoggedIn) {
            res.status(200).json({
              message: "Login successful",
              admin_id: isLoggedIn.admin_id,
              user_id: isLoggedIn.user_id
            });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getUserById = async (req,res) => {
    const userid = parseInt(req.params.id);

    try {
        const user = await Admin_Account.getUserById(userid);
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving User"); 
    }
}


const getAllUsers = async (req,res) => {
    try {
        const users = await Admin_Account.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users");
    } 
}


const AdmincreateAccount = async (req, res) => {
    const { username, user_email, user_phonenumber, user_password, user_role, security_code } = req.body;
    const newUserData = { username, user_email, user_phonenumber, user_password, user_role };

    try {
        const createdAccount = await Admin_Account.AdmincreateAccount(newUserData, security_code);
        res.status(201).json(createdAccount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
};


const AdminupdateUser = async (req,res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;

    try {
        const updatedUser = await Admin_Account.AdminupdateUser(userId, newUserData);
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating User");
    }
}


const AdmindeleteUser = async (req,res) => {
    const userId = parseInt(req.params.id);

    try {
        const success = await Admin_Account.AdmindeleteUser(userId);
        if (!success) {
            return res.status(403).send("User not found or cannot delete admin");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting User");
    }
}

const adminforgotpassword = async (req,res) => {
    const email = req.params.user_email;
  
    try {
        const user = await Admin_Account.adminforgotpassword(email);
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving User");
      }
  }

module.exports = {
    adminlogin,
    getUserById,
    getAllUsers,
    AdmincreateAccount,
    AdminupdateUser,
    AdmindeleteUser,
    adminforgotpassword,
};