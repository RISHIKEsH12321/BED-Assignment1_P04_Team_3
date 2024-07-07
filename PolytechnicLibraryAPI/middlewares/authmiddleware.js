const jwt = require("jsonwebtoken");
const Joi = require("joi");

function verifyJWT(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Define authorized roles for each endpoint
      const authorizedRoles = {
        "^/books$": ["member", "librarian"], // Anyone can view books
        "^/books/[0-9]+/availability$": ["librarian"], // Only librarians can update availability
      };
  
      const requestedEndpoint = req.url;
      const userRole = decoded.role;
  
      // Check if the user's role is authorized for the requested endpoint
      const authorizedRole = Object.entries(authorizedRoles).find(
        ([endpoint, roles]) => {
          const regex = new RegExp(endpoint); // Create RegExp from endpoint
          return regex.test(requestedEndpoint) && roles.includes(userRole);
        }
      );
  
      if (!authorizedRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      req.user = decoded; // Attach decoded user information to the request object
      next();
    });
  }
  
  module.exports = verifyJWT;