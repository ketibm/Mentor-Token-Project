const mongoose = require("mongoose");

const combinedCollSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    // imageUrl: { type: String },
    phone: { type: String },
    profileImage: { type: String, default: "path/to/default/image.svg" },
    role: {
      type: String,
      required: false,
      enum: ["mentor", "startup"],
      required: true,
    },
    profession: { type: String },
    skills: { type: [String] },
    desc: { type: String },
    acceptedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    representative: { type: String },
    address: { type: String },
    jobsPosted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  { timestamps: true }
);

combinedCollSchema.pre("save", function (next) {
  if (this.role === "mentor") {
    if (!this.profession || !this.desc) {
      console.log("Mentor fields validation failed");
    } else {
      this.representative = undefined;
      this.address = undefined;
      this.jobsPosted = undefined;
    }
  } else if (this.role === "startup") {
    if (!this.representative || !this.address) {
      return next(
        new Error("Representative and address are required for startups.")
      );
    }
    this.profession = undefined;
    this.skills = undefined;
    this.desc = undefined;
    this.acceptedJobs = undefined;
  }

  next();
});

const User = mongoose.model("User", combinedCollSchema, "newUsers");

const filterFields = (user) => {
  if (!user) return null;
  const fieldsToRemove =
    user.role === "mentor"
      ? ["representative", "address", "jobsPosted"]
      : ["profession", "skills", "desc", "acceptedJobs"];
  fieldsToRemove.forEach((field) => delete user[field]);
  return user;
};

const create = async (acc) => {
  const user = new User(acc);
  return await user.save();
};

const getById = async (id) => {
  const user = await User.findById(id).lean();
  return filterFields(user);
};

const getByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  return filterFields(user);
};

const setNewPassword = async (userId, newPassword) => {
  return await User.updateOne({ _id: userId }, { password: newPassword });
};

const getAll = async (filter) => {
  const users = await User.find(filter).lean();
  return users.map(filterFields);
};

const update = async (id, acc) => {
  return await User.updateOne({ _id: id }, acc);
};

const remove = async (id) => {
  return await User.deleteOne({ _id: id });
};

const saveImageURL = async (userId, imageUrl) => {
  try {
    const finalImagePath = imageUrl || "path/to/defaultImagePath.svg";
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: finalImagePath },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error("Error updating user profile image URL:", error);
    throw error;
  }
};

module.exports = {
  User,
  create,
  getById,
  getByEmail,
  setNewPassword,
  getAll,
  update,
  remove,
  saveImageURL,
};
