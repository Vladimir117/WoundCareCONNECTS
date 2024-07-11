const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Models
const WoundcareModel = require('../models/Woundcare');
const SubmissionModel = require('../models/Submission');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
});

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

const AGENCY_DASHBOARD_URL = process.env.AGENCY_URL || 'http://localhost:5033/agency';

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
    const sanitizedEmail = sanitizeHtml(email);
    const user = await WoundcareModel.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(400).json({ error: "User with given email does not exist." });
    }

    const token = jwt.sign({ email: sanitizedEmail }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const url = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      to: sanitizedEmail,
      subject: 'Reset Password',
      html: `Click <a href="${url}">here</a> to reset your password.`,
    });

    return res.json({ message: "Password reset link sent to your email account" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const sanitizedPassword = sanitizeHtml(password);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    const user = await WoundcareModel.findOneAndUpdate(
      { email: payload.email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid token or user does not exist." });
    }

    return res.json({ message: "Password successfully reset" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the directory where files will be stored
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