const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const crypto = require('crypto');

// Models
const UserModel = require('../models/User');

// Utils
const sendPasswordResetEmail = require('../utils/email');

// Constants
const AGENCY_DASHBOARD_URL = process.env.AGENCY_URL || '/agency';

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

    req.session.userId = user._id;

    // Determine the redirect URL based on the user's role
    const redirectUrl = user.role === 'agency' ? AGENCY_DASHBOARD_URL : '/';

    return res.json({ 
      message: "Login successful!", 
      token: 'your-generated-jwt-token', // Generate and return JWT token or any other auth token
      redirectUrl 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
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