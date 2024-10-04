const mongoose = require("mongoose");
const { User } = require("../combinedCollection");
const jobCollSchema = mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["IT", "HR", "Marketing", "Management", "Finance"],
    },
    status: {
      type: String,
      enum: ["Direct", "Open"],
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobCollSchema, "newJobs");

const createJob = async (data) => {
  if (
    !data.jobTitle ||
    !data.jobDescription ||
    !data.jobStatus ||
    !data.companyId
  ) {
    throw new Error("Missing required job fields.");
  }
  const jobData = {
    title: data.jobTitle,
    description: data.jobDescription,
    skillsRequired: data.skills || [],
    category: data.category,
    status: data.jobStatus,
    companyId: data.companyId,
  };

  const job = new Job(jobData);
  const savedJob = await job.save();

  if (savedJob.companyId) {
    await User.findByIdAndUpdate(savedJob.companyId, {
      $push: { jobsPosted: savedJob._id },
    });
  }
  return savedJob;
};

const getOneJob = async (id) => {
  return await Job.findById(id).populate("companyId");
};

const getAllJobs = async () => {
  return await Job.find({}).populate("companyId").exec();
};

const updateJob = async (id, data) => {
  return await Job.findByIdAndUpdate(id, data, { new: true });
};

const removeJob = async (id) => {
  return await Job.findByIdAndDelete(id);
};

module.exports = {
  createJob,
  getOneJob,
  getAllJobs,
  updateJob,
  removeJob,
};
