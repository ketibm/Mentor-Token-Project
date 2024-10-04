const {
  createJob,
  getOneJob,
  getAllJobs,
  updateJob,
  removeJob,
} = require("../pkg/jobCollection");
const { App } = require("../pkg/applicationCollection");

const createJobCollection = async (req, res) => {
  try {
    const jobData = await createJob(req.body);
    const savedJob = await jobData.save();
    res.status(201).json({ job: savedJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneJobCollection = async (req, res) => {
  try {
    const job = await getOneJob(req.params.id);
    if (!job) {
      return res.status(404).send("Job not found");
    }
    return res.status(200).send(job);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getAllJobCollections = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    return res.status(200).send(jobs);
  } catch (err) {
    console.error("Error fetching all job collections:", err);
    return res.status(500).send("Internal Server Error");
  }
};

const updateJobCollection = async (req, res) => {
  try {
    const updatedJobCollection = await updateJob(req.params.id, req.body);
    if (!updatedJobCollection) {
      return res.status(404).send("Job not found");
    }
    return res.status(200).send(updatedJobCollection);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const deleteJobCollection = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await getOneJob(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    await await removeJob(id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getAppliedMentors = async (req, res) => {
//   try {
//     //   const jobId = req.params.id;
//     //   // Fetch applied mentors logic, adjust based on your schema
//     //   const job = await getOneJob(jobId).populate("appliedMentors"); // Example field
//     //   if (!job) {
//     //     return res.status(404).json({ message: "Job not found" });
//     //   }
//     //   res.status(200).json(job.appliedMentors);
//     // } catch (err) {
//     //   res.status(500).json({ message: "Internal Server Error" });
//     const jobId = req.params.id;
//     // Your logic to fetch applied mentors
//     const mentors = await getOneJob({ jobId }).populate("appliedMentors");
//     res.json(mentors);
//   } catch (error) {
//     console.error("Error fetching applied mentors:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports = {
  createJobCollection,
  getOneJobCollection,
  getAllJobCollections,
  updateJobCollection,
  deleteJobCollection,
  // getAppliedMentors,
};
