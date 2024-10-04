const {
  App,
  createApp,
  getOneApp,
  getAllApps,
  updateApp,
  removeApp,
} = require("../pkg/applicationCollection");
const User = require("../pkg/combinedCollection");
const Job = require("../pkg/jobCollection");

const createApplication = async (req, res) => {
  try {
    const {
      mentorId,
      jobId,
      companyId,
      applicationType,
      status = "pending",
      acceptedStatus = "IN PROGRESS",
    } = req.body;

    if (!mentorId || !jobId || !companyId || !applicationType) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const application = {
      mentorId,
      jobId,
      companyId,
      applicationType,
      status,
      acceptedStatus,
    };
    const newApplication = await createApp(application);
    res.status(201).json(newApplication);
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOneApplication = async (req, res) => {
  try {
    const App = await getOneApp(req.params.id);
    if (!App) {
      return res.status(404).send("Application not found");
    }
    return res.status(200).send(App);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getApplicationsByMentor = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: "Invalid mentor ID" });
    }

    const applications = await App.find({
      mentorId: mentorId,
    })
      .populate("applicationType")
      .exec();

    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this mentor." });
    }
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications.", error });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const Apps = await getAllApps();
    return res.status(200).json(Apps);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json("Internal Server Error");
  }
};

const updateApplication = async (req, res) => {
  try {
    const updatedApplication = await updateApp(req.params.id, req.body);

    if (!updatedApplication) {
      return res.status(404).json("Application not found");
    }
    return res.status(200).json(updatedApplication);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const deleteApplication = async (req, res) => {
  try {
    const deletedApp = await removeApp(req.params.id);
    if (!deletedApp) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res
      .status(200)
      .json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAppliedMentors = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`Fetching applied mentors for jobId: ${jobId}`);
    const applications = await App.find({ jobId })
      .populate("mentorId", "name email profileImage")
      .exec();

    if (applications.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applied mentors:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const assignMentor = async (req, res) => {
  const { mentorId, jobId, applicationId, status, acceptedStatus } = req.body;
  console.log("Received request to assign mentor:", req.body);
  if (!mentorId || !applicationId) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  if (!["accepted", "rejected", "pending", "canceled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }
  if (!["DONE", "REJECTED", "IN PROGRESS"].includes(acceptedStatus)) {
    return res.status(400).json({ message: "Invalid accepted status." });
  }
  try {
    const updatedApplication = await App.findByIdAndUpdate(
      applicationId,

      { mentorId, status, acceptedStatus },
      { new: true, runValidators: true }
    );
    console.log("Updated application:", updatedApplication);
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found." });
    }
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error in assign-mentor:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createApplication,
  getOneApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
  getApplicationsByMentor,
  getAppliedMentors,
  assignMentor,
};
