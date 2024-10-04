import React, { useState, useEffect } from "react";
import MyButton from "../../components/Button/MyButton";
import JobPopup from "../Popup/JobPopup";
import "./StartupCardComp.css";

const StartupCardComp = ({
  jobs,
  role,
  incrementAppliedJobs,
  isInPopup = false,
  className,
  jobId,
}) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [popupVisible, setPopupVisibility] = useState(false);
  const [appliedMentors, setAppliedMentors] = useState({});

  const handleOpenPopup = (job) => {
    setSelectedJob(job);
    setPopupVisibility(true);
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
    setPopupVisibility(false);
  };

  const fetchJobDetails = async () => {
    if (!jobId) return;
    try {
      const response = await fetch(`http://localhost:8000/api/job/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch job details");
      const jobData = await response.json();
      setJob(jobData);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  const fetchAppliedMentors = async (jobId) => {
    if (!jobId) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/apps/${jobId}/applied-mentors`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch applied mentors");

      const applications = await response.json();
      setAppliedMentors((prev) => ({ ...prev, [jobId]: applications }));
    } catch (error) {
      console.error("Error fetching applied mentors:", error);
    }
  };
  useEffect(() => {
    if (jobId) {
      fetchAppliedMentors();
      fetchJobDetails();
    }
  }, [jobId]);

  const truncateDesc = (description) => {
    if (!description) return "No description provided";
    return isInPopup
      ? description
      : description.length > 80
      ? `${description.substring(0, 80)}...`
      : description;
  };

  const truncateSkills = (skills) => {
    if (!skills || skills.length === 0) return "No skills specified";
    return isInPopup
      ? skills
      : skills.length > 50
      ? `${skills.substring(0, 50)}...`
      : skills;
  };

  return (
    <div className={`job-container ${isInPopup ? "popup-view" : ""}`}>
      {Array.isArray(jobs) && jobs.length > 0 ? (
        <ul className="jobs-list">
          {jobs.map((job) => {
            const appliedMentorsForJob = appliedMentors[job._id] || [];
            const companyId = job.companyId || {};
            const companyName = companyId.name || "Unknown Startup";
            const companyImageUrl = companyId.profileImage
              ? `http://localhost:8000/${companyId.profileImage}`
              : "/path/to/default/image.jpg";

            const jobDescription = job.description || "No description provided";
            const skills =
              Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0
                ? job.skillsRequired.join(", ")
                : "No skills specified";

            return (
              <li
                className={`job-card ${className}`}
                key={job._id}
                onClick={() => handleOpenPopup(job)}
              >
                <div className="job-container-company">
                  <img
                    src={companyImageUrl}
                    alt={companyName}
                    className="mentor-image"
                  />
                  <h2 className="job-title">{companyName}</h2>
                </div>
                <h3 className="job-profession">{job.title}</h3>

                <p className="job-description">
                  <strong>Job description:</strong>
                  {role === "mentor"
                    ? job.description
                    : truncateDesc(job.description)}
                </p>
                <p>
                  <strong>Skills:</strong>
                  {role === "mentor"
                    ? job.skillsRequired.join(", ")
                    : truncateSkills(skills)}
                </p>

                <p>
                  <strong>Category:</strong> {job.category}
                </p>

                {role === "startup" && (
                  <div className="mentors-list">
                    {appliedMentorsForJob.length > 0 ? (
                      <>
                        {appliedMentorsForJob.slice(0, 3).map((mentor) => {
                          const mentorImageUrl = mentor.mentorId?.profileImage
                            ? `http://localhost:8000/${mentor.mentorId.profileImage}`
                            : "/images/default-profile.jpg";

                          return (
                            <div className="mentor-item" key={mentor._id}>
                              <img
                                src={mentorImageUrl}
                                alt={mentor.mentorId?.name || "Mentor"}
                                className="mentor-image-applied"
                              />
                              <span className="mentor-name">
                                {mentor.mentorId?.name || "Unknown Mentor"}
                              </span>
                            </div>
                          );
                        })}

                        {appliedMentorsForJob.length > 3 && (
                          <span className="more-mentors">3+ Applicants</span>
                        )}
                      </>
                    ) : (
                      <p>No mentors applied for this job yet.</p>
                    )}
                  </div>
                )}
                <br />
                <br />
                {!isInPopup && (
                  <div className="jobButton-button_view">
                    <MyButton
                      type="button"
                      hasIcon={false}
                      name="View More"
                      onClick={() => {
                        if (job.status !== "Direct") handleOpenPopup(job);
                      }}
                      className={`job-button ${
                        job.status === "Direct" ? "disabled" : ""
                      }`}
                      disabled={job.status === "Direct"}
                    />
                  </div>
                )}
                {role === "mentor" && (
                  <div className="jobButton-button_apply">
                    <MyButton
                      type="button"
                      hasIcon={false}
                      name="Apply"
                      className="apply-button"
                      onClick={() => handleApply(job._id)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No jobs available</p>
      )}
      {popupVisible && selectedJob && (
        <JobPopup
          jobId={selectedJob._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={true}
          appliedMentors={appliedMentors[selectedJob._id] || []}
          companyId={selectedJob.companyId._id}
          incrementAppliedJobs={incrementAppliedJobs}
          isInPopup={true}
        />
      )}
    </div>
  );
};
export default StartupCardComp;
