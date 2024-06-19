const User_Account = require("../models/User_Account");

const userlogin = async (req,res) => {
    const { username, user_password } = req.body;

    try {
        // Call the userlogin method from the model
        const isLoggedIn = await User_Account.userlogin(username, user_password);

        if (isLoggedIn) {
            res.status(200).json({
              message: "Login successful",
              user_id: isLoggedIn.user_id // Return user_id along with a success message
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
        const user = await User_Account.getUserById(userid);
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving User");
      }
}

const createAccount = async (req, res) => {
    const newaccount = req.body;
    try {
      const createdAccount = await User_Account.createAccount(newaccount);
      res.status(201).json(createdAccount);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating User");
    }
};

const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;
  
    try {
      const updatedUser = await User_Account.updateUser(userId, newUserData);
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating User");
    }
};
  
const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
  
    try {
      const success = await User_Account.deleteUser(userId);
      if (!success) {
        return res.status(404).send("User not found");
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting User");
    }
};


const userforgotpassword = async (req,res) => {
  const email = req.params.user_email;

  try {
      const user = await User_Account.userforgotpassword(email);
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
    userlogin,
    getUserById,
    createAccount,
    updateUser,
    deleteUser,
    userforgotpassword
};