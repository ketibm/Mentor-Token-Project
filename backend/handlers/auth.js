const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Validator } = require("node-input-validator");
const fs = require("fs");
const path = require("path");
const defaultImagePath = path.join(__dirname, "..", "assets", "Default.svg");

const { sendEmail, sendWelcomeEmail } = require("./mailer");
const {
  create,
  getByEmail,
  setNewPassword,
} = require("../pkg/combinedCollection");

const {
  UserLogin,
  UserRegister,
  UserRegisterStartup,
  UserRegisterMentor,
  UserReset,
  validate,
} = require("../pkg/combinedCollection/validate");
const { getSection, transporter } = require("../pkg/config");

const login = async (req, res) => {
  try {
    await validate(req.body, UserLogin);
    const { email, password } = req.body;
    const user = await getByEmail(email);

    if (!user) {
      return res.status(400).send("User not found!");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send("Wrong password!");
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user._id,
      role: user.role,
      exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
    };
    const token = jwt.sign(payload, getSection("development").jwt_secret);
    return res.status(200).send({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
};

const register = async (req, res) => {
  try {
    await validate(req.body, UserRegister);
    const { name, email, password, confirmPassword, role } = req.body;

    if (!["startup", "mentor"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }

    const exists = await getByEmail(email);
    if (exists) {
      return res.status(400).json("User with this email already exists!");
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json("Confirmed password is not the same as password!");
    }

    req.body.password = bcrypt.hashSync(password, 8);
    req.body.profileImage = "path/to/default/image.svg";
    const user = await create(req.body);

    const userImageDir = path.join(
      __dirname,
      "../uploads/",
      user._id.toString()
    );
    if (!fs.existsSync(userImageDir)) {
      fs.mkdirSync(userImageDir, { recursive: true });
    }
    fs.copyFileSync(
      defaultImagePath,
      path.join(userImageDir, "defaultImage.svg")
    );

    return res.status(201).send(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

const registerStartup = async (req, res) => {
  await validate(req.body, UserRegisterStartup);
  try {
    const { name, email, password, phone, address, representative } = req.body;

    if (!name || !email || !password || !phone || !address || !representative) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const exists = await getByEmail(email);
    if (exists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists!" });
    }

    req.body.password = bcrypt.hashSync(password, 10);
    req.body.role = "startup";

    let profileImage = "path/to/default/image.svg";
    if (req.file) {
      profileImage = req.file.path;
    }
    req.body.profileImage = profileImage;

    const startup = await create(req.body);

    await sendWelcomeEmail({
      to: email,
      subject: "Welcome!",
      text: `Hello ${name}, welcome to our platform!`,
      html: `<h1>Hello ${name}</h1><p>Welcome to our platform!</p>`,
    });

    return res.status(201).json({
      message: "Registration successful",
      userId: startup._id,
      startup,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const registerMentor = async (req, res) => {
  try {
    await validate(req.body, UserRegisterMentor);
    const { name, email, phone, password, profession, skills, desc } = req.body;

    if (!name || !email || !phone || !profession || !skills || !desc) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const exists = await getByEmail(email);
    if (exists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists!" });
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ message: "Invalid password" });
    }

    req.body.password = bcrypt.hashSync(password, 8);
    req.body.role = "mentor";

    let profileImage = "path/to/default/image.svg";
    if (req.file) {
      profileImage = req.file.path;
    }
    req.body.profileImage = profileImage;

    const mentor = await create(req.body);

    await sendWelcomeEmail({
      to: email,
      subject: "Welcome!",
      text: `Hello ${name}, welcome to our platform!`,
      html: `<h1>Hello ${name}</h1><p>Welcome to our platform!</p>`,
    });

    return res.status(201).json({
      message: "Registration successful",
      userId: mentor._id,
      mentor: mentor,
    });
  } catch (error) {
    console.error("Validation or registration error:", error);
    return res.status(500).json({
      error: "Validation or registration error",
      details: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  const payload = {
    ...req.auth,
    exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
  };
  console.log("req.auth", req.auth);
  const token = jwt.sign(payload, getSection("development").jwt_secret);
  return res.send({ token });
};

const resetPassword = async (req, res) => {
  await validate(req.body, UserReset);
  const { email, newPassword, oldPassword } = req.body;
  const user = await getByEmail(email);

  if (!user) {
    return res.status(400).json("User with this email does not exists!");
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(400).json("Incorrect old password!");
  }

  if (newPassword === oldPassword) {
    return res.status(400).json("New password cannot be the old password!");
  }

  const newPasswordHashed = bcrypt.hashSync(newPassword);
  const userPasswordChanged = await setNewPassword(
    user._id.toString(),
    newPasswordHashed
  );
  return res.status(200).json(userPasswordChanged);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password",
    text: "Please use the following link to reset your password: <link>",
  };

  try {
    await sendEmail(mailOptions);
    return res.status(200).json({ message: "Reset email sent!" });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return res.status(500).json({ message: "Error sending reset email." });
  }
};

module.exports = {
  login,
  register,
  registerStartup,
  registerMentor,
  resetPassword,
  forgotPassword,
  refreshToken,
  // sendResetPasswordEmail,
};
