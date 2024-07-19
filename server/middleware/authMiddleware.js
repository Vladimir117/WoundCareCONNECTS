const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    // Fetch user and attach to request
    req.user = await UserModel.findById(decoded.id).select('-password'); 
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
