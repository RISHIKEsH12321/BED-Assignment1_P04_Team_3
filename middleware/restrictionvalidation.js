const jwt = require("jsonwebtoken");

function verifyJWTuser(req, res, next) {
  // Get the token from the request body
  const token = req.body.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify and decode the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    // Check if the user has the "admin" role
    if (!decoded.userrole || decoded.userrole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Attach the decoded token to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
}

module.exports = {verifyJWTuser};
