const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const crypto = require('crypto');
const postmark = require('postmark');
const path = require('path');

// Models
const WoundcareModel = require('../models/Woundcare');
const SubmissionModel = require('../models/Submission');

// Utils
const sendPasswordResetEmail = require('../utils/email');
const sendContactUsEmail = require('../utils/sendContactUsEmail');

// Constants
const AGENCY_DASHBOARD_URL = process.env.AGENCY_URL || '/agency';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPassword = sanitizeHtml(password);

    const existingUser = await WoundcareModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
    const newUser = new WoundcareModel({ name, email: sanitizedEmail, password: hashedPassword });
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

    const user = await WoundcareModel.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.userId = user._id;

    // Check if the user's email matches the specific email
    if (user.email === 'ana@woundcareconnects.com' || user.email === 'ron@woundcareconnects.com') {
      return res.json({ redirectUrl: AGENCY_DASHBOARD_URL }); // Return the redirect URL to frontend
    }

    return res.json({ message: "Login successful!" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await WoundcareModel.findOne({ email });

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
      const user = await WoundcareModel.findOne({
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

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads')); // Set the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename file if needed
  }
});

const upload = multer({ storage: storage });

exports.submission = [
  upload.array('attachments', 10), // Multer middleware setup
  async (req, res) => {
    const { agency_address, agency_phone, agency_email, h_agency_name, h_agency_phone, h_agency_email, h_agency_position, h_agency_referred, patient_name, patient_address, patient_phone, patient_birth, emergency_name, emergency_address, emergency_phone, emergency_relationship, primary_insurance, primary_member, secondary_insurance, secondary_member, wound_information, wound_size } = req.body;

    // Assuming 'attachments' are received as files in req.files array
    const attachments = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype
    }));

    try {
      const newSubmission = new SubmissionModel({
        agency_address, agency_phone, agency_email,
        h_agency_name, h_agency_phone, h_agency_email, h_agency_position, h_agency_referred,
        patient_name, patient_address, patient_phone, patient_birth,
        emergency_name, emergency_address, emergency_phone, emergency_relationship,
        primary_insurance, primary_member, secondary_insurance, secondary_member,
        wound_information, wound_size, attachments
      });

      const savedSubmission = await newSubmission.save();

      res.status(201).json({ message: 'Submission received successfully', data: savedSubmission });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save submission' });
    }
  }
];

// Get all submissions list
exports.submissionList = async (req, res) => {
  try {
    const submissions = await SubmissionModel.find({}, 'patient_name patient_address createdAt');
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

// Get submission detail
exports.submissionDetail = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from request parameters
    const submission = await SubmissionModel.findById(id); // Use findById to find the document by id
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (err) {
    console.error('Error fetching submission:', err);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
};

// Contact
exports.contactUs = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await sendContactUsEmail(name, email, phone, message);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};