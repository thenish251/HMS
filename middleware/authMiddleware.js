// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Authentication middleware
exports.authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user object to the request for further processing
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Authorization middleware for admin access
exports.authorizeAdmin = (req, res, next) => {
  // Check if the user role is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
