const {
  User,
  create,
  getById,
  getAll,
  update,
  remove,
  saveImageURL,
} = require("../pkg/combinedCollection");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

const createUser = async (req, res) => {
  try {
    const newUser = await create(req.body);
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await getById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found!");
    }
    console.log("Fetched user:", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await getAll(filter);
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
};

const updateUser = async (req, res) => {
  try {
    const updateData = req.body;
    const user = await update(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json("User not found!");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await remove(req.params.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    res.status(200).send("User deleted successfully!");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const profileImagePath = `uploads/${file.filename}`;

    const updatedUser = await saveImageURL(userId, profileImagePath);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      profileImage: `http://localhost:8000/${profileImagePath}`,
      message: "Profile image updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getOneUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserProfile,
};
