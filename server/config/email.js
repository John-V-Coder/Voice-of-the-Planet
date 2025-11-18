const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Use App Password for Gmail
    },
  });
};

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email transporter is ready');
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error.message);
    return false;
  }
};

const sendMail = async (to, subject, html) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error.message);
        throw error; // Re-throw the error for the controller to handle
    }
};

module.exports = {
  createTransporter,
  verifyTransporter,
  sendMail,
};