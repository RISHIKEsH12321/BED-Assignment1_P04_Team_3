// Admin Controller (Ye Chyang)
const Admin_Account = require("../models/Admin_Account");
const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRole = require("../middleware/validateRole");
const { user } = require("../dbConfig");

const adminlogin = async (req, res) => {
    const { username, user_password } = req.body;

    try {
        // Fetch admin details from the database
        const admin = await Admin_Account.adminlogin(username);

        if (admin) {
            // Compare the provided password with the stored hashed password
            const isMatch = await bcryptjs.compare(user_password, admin.user_password);

            if (isMatch) {

                const payload = {
                    user_id: admin.user_id,
                    username: admin.username,
                    admin_id: admin.admin_id,
                };

                const token = jwt.sign(payload, process.env.JWT_SECERT, { expiresIn: "3600s" });
                res.status(200).json({
                    message: "Login successful",
                    token: token,
                    admin_id: admin.admin_id,
                    user_id: admin.user_id
                });
            } else {
                res.status(401).json({ message: "Invalid username or password" });
            }
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Login Error: ", error);
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

    try {
        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(user_password, salt);

        // Create new user data object with hashed password
        const newUserData = { 
            username, 
            user_email, 
            user_phonenumber, 
            user_password: hashedPassword, 
            user_role 
        };

        const createdAccount = await Admin_Account.AdmincreateAccount(newUserData, security_code);
        res.status(201).json(createdAccount);
    } catch (error) {
        console.error(error);
        if (error.message.includes("Validation")) {
            res.status(400).send("Validation error");
        } else {
            res.status(500).send("Error creating user");
        }
    }
};



const AdminupdateUserwithemail = async (req, res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;

    try {
        if (newUserData.user_password) {
            // Hash the new password
            const salt = await bcryptjs.genSalt(10);
            newUserData.user_password = await bcryptjs.hash(newUserData.user_password, salt);
        } else {
            // Remove user_password from newUserData if it's not provided
            delete newUserData.user_password;
        }

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


const AdminupdateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;

    try {
        const role = await validateRole.validateRoleUsingToken(req);
        
        if (role === 'admin') {

            const userToUpdate = await Admin_Account.getUserById(userId);

            if (!userToUpdate) {
                return res.status(404).send("User not found");
            }

            if (userToUpdate.user_role === 'admin' && parseInt(req.body.user_id) !== userId) {
                return res.status(403).send('Access denied. Admins cannot update other admin accounts.');
            }

            // Admin can update any user's profile
            if (newUserData.user_password) {
                // Hash the new password
                const salt = await bcryptjs.genSalt(10);
                newUserData.user_password = await bcryptjs.hash(newUserData.user_password, salt);
            } else {
                // Remove user_password from newUserData if it's not provided
                delete newUserData.user_password;
            }

            const updatedUser = await Admin_Account.AdminupdateUser(userId, newUserData);
            if (!updatedUser) {
                return res.status(404).send("User not found");
            }
            return res.json(updatedUser);
        } else if (role === 'user') {
            // User can only update their own profile
            if (parseInt(req.body.user_id) !== userId) {
                return res.status(403).send('Access denied. You can only update your own profile.');
            }

            if (newUserData.user_password) {
                // Hash the new password
                const salt = await bcryptjs.genSalt(10);
                newUserData.user_password = await bcryptjs.hash(newUserData.user_password, salt);
            } else {
                // Remove user_password from newUserData if it's not provided
                delete newUserData.user_password;
            }

            const updatedUser = await Admin_Account.AdminupdateUser(userId, newUserData);
            if (!updatedUser) {
                return res.status(404).send("User not found");
            }
            return res.json(updatedUser);
        } else {
            return res.status(403).send('Access denied. Admins only.');
        }
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
        res.status(500).send("Admin account cannot be deleted");
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
    AdminupdateUserwithemail
};