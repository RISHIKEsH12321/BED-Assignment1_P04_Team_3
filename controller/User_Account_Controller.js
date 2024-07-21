// User controller (Ye Chyang)
const User_Account = require("../models/User_Account");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const userlogin = async (req,res) => {
//     const { username, user_password } = req.body;

//     try {
//         // Call the userlogin method from the model
//         const isLoggedIn = await User_Account.userlogin(username, user_password);

//         if (isLoggedIn) {
//             res.status(200).json({
//               message: "Login successful",
//               user_id: isLoggedIn.user_id // Return user_id along with a success message
//             });
//         } else {
//             res.status(401).json({ message: "Invalid username or password" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }

// };

const userlogin = async (req, res) => {
  const { username, user_password } = req.body;

  try {
      // Fetch user from the database
      const user = await User_Account.userlogin(username);

      if (user) {
          // Compare the hashed password
          const isMatch = await bcryptjs.compare(user_password, user.user_password);

          if (isMatch) {
              // Define the payload
              const payload = {
                  user_id: user.user_id,
                  username: user.username,
              };

              // Generate JWT token
              const token = jwt.sign(payload, process.env.JWT_SECERT, { expiresIn: "3600s" });
              res.status(200).json({
                  message: "Login successful",
                  token: token,
                  user_id: user.user_id // Return user_id along with a success message
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

// const createAccount = async (req, res) => {
//     const newaccount = req.body;
//     try {
//       const createdAccount = await User_Account.createAccount(newaccount);
//       res.status(201).json(createdAccount);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error creating User");
//     }
// };
const createAccount = async (req, res) => {
  const { username, user_email, user_phonenumber, user_password, user_role } = req.body;

  if (!username || !user_email || !user_phonenumber || !user_password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(user_password, salt);

      const newaccount = {
          username: username,
          user_email: user_email,
          user_phonenumber: user_phonenumber,
          user_password: hashedPassword, // Use the hashed password
          user_role: user_role
      };

      const createdAccount = await User_Account.createAccount(newaccount);
      res.status(201).json(createdAccount);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error creating User");
  }
};


// const updateUser = async (req, res) => {
//     const userId = parseInt(req.params.id);
//     const newUserData = req.body;
  
//     try {
//       const updatedUser = await User_Account.updateUser(userId, newUserData);
//       if (!updatedUser) {
//         return res.status(404).send("User not found");
//       }
//       res.json(updatedUser);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error updating User");
//     }
// };

const updateUser = async (req, res) => {
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

      const updatedUser = await User_Account.updateUser(userId, newUserData);
      if (!updatedUser) {
          return res.status(404).send("User not found");
      }
      return res.status(200).json(updatedUser);
  } catch (error) {
      console.error("Update User Error: ", error);
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
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving User");
    }
}

const checkPassword = async (req, res) => {
  const { user_id, currentPassword } = req.body;

  try {
      // Fetch user from the database
      const user = await User_Account.getUserById(user_id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Compare the hashed password
      const isMatch = await bcryptjs.compare(currentPassword, user.user_password);

      if (isMatch) {
          res.status(200).json({ message: "Password is correct" });
      } else {
          res.status(401).json({ message: "Invalid password" });
      }
  } catch (error) {
      console.error("Password Check Error: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
    userlogin,
    getUserById,
    createAccount,
    updateUser,
    deleteUser,
    userforgotpassword,
    checkPassword
};