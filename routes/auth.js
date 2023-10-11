// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { JWT_SECRET } = require('../utils/jwt');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');






router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password=hashedPassword;

    // Create a new user
    const newUser = await User.create(req.body)
    // Save the user to the database
     

  res.status(201).json({ message: 'User registered successfully.',data:newUser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create and send a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }

});


// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    function generateNumericOTP(length) {
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      return String(Math.floor(min + Math.random() * (max - min + 1)));
    }
    const numericOTP = generateNumericOTP(6);  
    res.json({ message: 'Numeric OTP sent to your email or phone.', numericOTP });
 // Send the OTP to the user via email

 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "eclecticatmsl23@gmail.com",
    pass: "okotejdvjinfjwff",
  },
  debug: true,
});


 const mailOptions = {
   from: 'eclecticatmsl23@gmail.com',
   to: user.email,
   subject: 'Password Reset OTP',
   text: `Your one-time password (OTP) for password reset is: ${numericOTP}`,
 };
 

 transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
     console.error(error);
     return res.status(500).json({ message: 'Failed to send OTP via email.' });
   } else {
     res.json({ message: 'Password reset OTP sent via email.',data:otp });
   }
 });
} catch (error) {
 console.error(error);
 res.status(500).json({ message: 'Internal server error.' });
}
});


module.exports = router;
