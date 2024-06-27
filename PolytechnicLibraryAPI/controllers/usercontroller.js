const User = require("../models/user");
const bcryptjs = require("bcryptjs");

async function registerUser(req, res) {
  const { username, passwordHash, role } = req.body;

  try {
    // Validate user data
    // ... your validation logic here ...
    // const errors = validateRegistration(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // Check for existing username
    console.log(req.body);
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(passwordHash, salt);

    await User.createUser(username, hashedPassword, role)

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// const validateRegistration = (body)=>{
//     [
//         body.username.isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
//         body.passwordHash.isStrongPassword().withMessage('Password must be strong'),
//         body.role.isIn(['member', 'librarian']).withMessage('Role must be either member or librarian')
//     ];
// } 


module.exports = {
    registerUser,
    // validateRegistration
  };