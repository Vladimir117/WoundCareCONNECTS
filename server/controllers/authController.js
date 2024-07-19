const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const crypto = require('crypto');

// Models
const UserModel = require('../models/User');

// Utils
const sendPasswordResetEmail = require('../utils/email');
const generateToken = require('../utils/generateToken');


// Constants
const AGENCY_DASHBOARD_URL = process.env.AGENCY_URL || '/agency';

// Endpoint to fetch user info
exports.auth = async (req, res) => {
  try {
    // Extract user ID from the request object, assuming it's added by the middleware
    const userId = req.user.id; 
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' });
    }

    // Fetch user from database, excluding password field
    const user = await UserModel.findById(userId).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Return user data
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPassword = sanitizeHtml(password);

    const user = await UserModel.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = generateToken(user);

    // Send the user info and token in the response
    return res.json({ 
      message: "Login successful!", 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // Add any other user information you want to include
      },
      redirectUrl: user.role === 'agency' ? AGENCY_DASHBOARD_URL : '/'
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPassword = sanitizeHtml(password);

    const existingUser = await UserModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
    const newUser = new UserModel({ name, email: sanitizedEmail, password: hashedPassword });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Save token to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'A password reset email has been sent. Please check your inbox.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
      // Find the user by token and check if the token is still valid
      const user = await UserModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Validate the new password (e.g., length, complexity)
      if (!password || password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      // Reset the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Clear the reset token and expiration
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save the updated user
      await user.save();

      res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Server error' });
  }
};