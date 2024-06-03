const Admin_Account = require("../models/Admin_Account");

const adminlogin = async (req,res) => {
    const { username, user_password } = req.body;

    try {
        // Call the userlogin method from the model
        const isLoggedIn = await Admin_Account.adminlogin(username, user_password);

        if (isLoggedIn) {
            // If login is successful
            res.status(200).send("login Successful")
        } else {
            // If login failed
            res.status(401).send("Invalid username or password")
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error")
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


const AdmincreateAccount = async (req,res) => {
    const newaccount = req.body;
    try {
        const createdAccount = await Admin_Account.AdmincreateAccount(newaccount);
        res.status(201).json(createdAccount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating User");
    }
}


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

module.exports = {
    adminlogin,
    getUserById,
    getAllUsers,
    AdmincreateAccount,
    AdminupdateUser,
    AdmindeleteUser
};