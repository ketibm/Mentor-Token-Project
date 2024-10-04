const mongoose = require("mongoose");
const { User } = require("../combinedCollection");

const applicationCollSchema = mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationType: {
      type: String,
      enum: ["mentorToCompany", "companyToMentor"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "canceled"],
      default: "pending",
      required: true,
    },
    acceptedStatus: {
      type: String,
      enum: ["DONE", "REJECTED", "IN PROGRESS"],
      required: true,
    },
  },
  { timestamps: true }
);

const App = mongoose.model("App", applicationCollSchema, "applications");

const createApp = async (data) => {
  const app = new App(data);
  return await app.save();
};

const getOneApp = async (id) => {
  return await App.findById(id)
    .populate("jobId")
    .populate("mentorId")
    .populate("companyId");
};

const getAllApps = async () => {
  return await App.find({})
    .populate("jobId", "title")
    .populate("mentorId", "name")
    .populate("companyId", "name")
    .exec();
};

const updateApp = async (id, data) => {
  const updatedApp = await App.findByIdAndUpdate(id, data, { new: true });
  if (!updatedApp) {
    throw new Error("Application not found");
  }

  if (updatedApp.status === "accepted" || updatedApp.status === "rejected") {
    await User.findByIdAndUpdate(updatedApp.mentorId, {
      $push: { acceptedJobs: updatedApp.jobId },
    });
  }

  return updatedApp;
};

const removeApp = async (id) => {
  return await App.findByIdAndDelete(id);
};

module.exports = {
  App,
  createApp,
  getOneApp,
  getAllApps,
  updateApp,
  removeApp,
};
