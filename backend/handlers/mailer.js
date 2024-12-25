const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { getByEmail, setNewPassword } = require("../pkg/combinedCollection");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendWelcomeEmail = async ({ to, subject, text, html }) => {
  // const subject = "Welcome to Mentor Token!";
  // const text = `Hi ${name},\n\nWelcome to Mentor Token! We're excited to have you on board. If you have any questions, feel free to reach out to us!`;
  // const html = `<h3>Welcome to Mentor Token, ${name}!</h3><p>We're excited to have you on board. If you have any questions, feel free to reach out to us!</p>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

const sendWelcomeEmailHandler = async (req, res) => {
  const { to, subject, text, html, name } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    await sendWelcomeEmail(to, name);

    res
      .status(200)
      .json({ message: "General and welcome email sent successfully." });
  } catch (error) {
    console.error("Error in email handler:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
};

const resetPasswordByEmail = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getByEmail(decoded.email);

    if (!user) {
      return res.status(400).json("User not found");
    }

    const newPasswordHashed = bcrypt.hashSync(newPassword, 10);
    await setNewPassword(user._id.toString(), newPasswordHashed);

    const subject = "Password Reset Confirmation";
    const text = "Your password has been reset successfully.";
    const html = `<h3>Password Reset Confirmation</h3><p>Your password has been reset successfully.</p>`;
    await sendEmail({ to: user.email, subject, text, html });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json("Reset token has expired. Please request a new one.");
    }
    return res.status(400).json("Invalid token.");
  }
};

const receiveEmail = async (req, res) => {
  console.log("Received request:", req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.error("Missing fields in request body");
    return res.status(400).json({ message: "Missing fields" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  };

  try {
    console.log("Sending email with options:", mailOptions);
    await sendEmail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email: ", error.message);
    res.status(500).json({ message: "Failed to send email." });
  }
};

module.exports = {
  transporter,
  sendEmail,
  sendWelcomeEmail,
  sendWelcomeEmailHandler,
  resetPasswordByEmail,
  receiveEmail,
};
