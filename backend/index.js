const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const { getSection, transporter } = require("./pkg/config");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

require("./pkg/db");
require("dotenv").config();
const app = express();
app.use(cors());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());

const {
  sendEmail,
  sendWelcomeEmail,
  resetPasswordByEmail,
  receiveEmail,
} = require("./handlers/mailer");

app.use(
  jwt({
    secret: getSection("development").jwt_secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/register/startup",
      "/api/auth/register/mentor",
      "/api/auth/forgot-password",
      "/api/auth/reset-password",
      "/api/auth/refresh-token",
    ],
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const {
  login,
  register,
  registerStartup,
  registerMentor,
  resetPassword,
  forgotPassword,
  refreshToken,
} = require("./handlers/auth");

const {
  createUser,
  getOneUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserProfile,
} = require("./handlers/users");

const {
  createJobCollection,
  getOneJobCollection,
  getAllJobCollections,
  updateJobCollection,
  deleteJobCollection,
} = require("./handlers/job");

const {
  createApplication,
  getOneApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
  getApplicationsByMentor,
  getAppliedMentors,
  assignMentor,
} = require("./handlers/application");

app.post("/api/auth/login", login);
app.get("/api/auth/refresh-token", refreshToken);
app.post("/api/auth/register", register);
app.post(
  "/api/auth/register/startup",
  upload.single("profileImage"),
  registerStartup
);
app.post(
  "/api/auth/register/mentor",
  upload.single("profileImage"),
  registerMentor
);

app.post("/api/auth/reset-password", resetPassword);
app.post("/api/auth/forgot-password", forgotPassword);

app.post("/api/email/sendMessage", sendEmail);
app.post("/api/email/send", sendWelcomeEmail);
app.post("/api/auth/reset-password/:id/:token", resetPasswordByEmail);
app.post("/api/email/receive-email", receiveEmail);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedAccess") {
    res.status(401).send("Invalid token...");
  }
});

app.get("/api/users", getAllUsers);
app.post("/api/user", createUser);
app.get("/api/user/:id", getOneUser);
app.put("/api/user/:id", updateUser);
app.delete("/api/user/:id", deleteUser);

app.put(
  "/api/user/:userId/profile-image",
  upload.single("profileImage"),
  updateUserProfile
);
app.post(
  "/api/user/:userId/profile-image",
  upload.single("profileImage"),
  updateUserProfile
);

app.get("/api/jobs", getAllJobCollections);
app.post("/api/job", createJobCollection);
app.get("/api/job/:id", getOneJobCollection);
app.put("/api/job/:id", updateJobCollection);
app.delete("/api/job/:id", deleteJobCollection);

app.get("/api/apps", getAllApplications);
app.post("/api/app", createApplication);
app.get("/api/app/:id", getOneApplication);
app.put("/api/app/:id", updateApplication);
app.patch("/api/app/:id", updateApplication);
app.delete("/api/app/:id", deleteApplication);
app.get("/api/apps/:mentorId", getApplicationsByMentor);
app.get("/api/apps/:jobId/applied-mentors", getAppliedMentors);
app.put("/api/app/assign-mentor", assignMentor);

app.post("/api/test", (req, res) => {
  console.log("Test endpoint hit:", req.body);
  res.json({ message: "Test successful!" });
});

app.listen(getSection("development").port, () => {
  console.log(`Server started at port ${getSection("development").port}`);
});
