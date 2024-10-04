import React, { useState, useEffect } from "react";
import StartupCardComp from "../Main/StartupCardComp";
import MyButton from "../Button/MyButton";
import close from "../../assets/DashAssets/close.svg";
import ModalCard from "../Modal/ModalCard";
import "./JobPopup.css";

const JobPopup = ({
  onClose,
  incrementAppliedJobs,
  companyId,
  jobId,
  showApplyButton,
  isInPopup,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showJobCard, setShowJobCard] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [job, setJob] = useState({});
  const [mentors, setMentors] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const currentUserId = localStorage.getItem("currentUserId");

  const fetchAppliedMentors = async () => {
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
      const userApplication = applications.find(
        (app) => app.mentorId?._id === currentUserId
      );
      setHasApplied(!!userApplication);

      setMentors(
        applications
          .filter(
            (app) => app.status !== "accepted" && app.status !== "rejected"
          )
          .map((app) => ({
            _id: app.mentorId?._id,
            name: app.mentorId?.name || "Unknown Mentor",
            applicationId: app._id,
            status: app.status,
          }))
      );
    } catch (error) {
      console.error("Error fetching applied mentors:", error);
      setModalMessage("Error fetching applied mentors.");
      setShowModal(true);
    }
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
  console.log("Job ID before fetching:", jobId);
  useEffect(() => {
    if (jobId) {
      fetchAppliedMentors();
      fetchJobDetails();
    }
  }, [jobId]);

  const handleApply = async () => {
    if (hasApplied) {
      setModalMessage("You have already applied for this job.");
      setShowModal(true);
      setShowJobCard(false);
      console.log("Modal should appear");
      return;
    }
    console.log("Modal Message:", modalMessage);
    console.log("Show Modal State:", showModal);
    try {
      const response = await fetch("http://localhost:8000/api/app", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId: currentUserId,
          jobId,
          companyId,
          applicationType: "mentorToCompany",
        }),
      });

      if (response.ok) {
        const newApplication = await response.json();
        console.log("New application created:", newApplication);
        setHasApplied(true);
        incrementAppliedJobs && incrementAppliedJobs(newApplication._id);
        setModalMessage("Application successful!");
        setShowModal(true);
        onClose();
      } else {
        setModalMessage("Error applying for the job.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setModalMessage("Error applying for the job.");
      setShowModal(true);
    }
  };

  const handleAssignMentor = async (mentorId, applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/app/${applicationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mentorId,
            status: "accepted",
            acceptedStatus: "DONE",
          }),
        }
      );

      if (response.ok) {
        setModalMessage("Mentor assigned successfully.");
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to assign mentor: ${errorMessage.message}`);
      }
      setShowModal(true);
      onClose();
    } catch (error) {
      console.error("Error assigning mentor:", error);
      setModalMessage("Error assigning mentor.");
      setShowModal(true);
    }
  };

  const handleRejectMentor = async (mentorId, applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/app/${applicationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mentorId,
            status: "rejected",
            acceptedStatus: "REJECTED",
          }),
        }
      );

      if (response.ok) {
        setModalMessage("Mentor rejected successfully.");
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to reject mentor: ${errorMessage.message}`);
      }
      setShowModal(true);
      onClose();
    } catch (error) {
      console.error("Error rejecting mentor:", error);
      setModalMessage("Error rejecting mentor.");
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="job-popup-overlay">
      <div className={`job-popup ${isInPopup ? "no-border" : ""}`}>
        <img
          src={close}
          alt="close"
          className="close-button"
          onClick={onClose}
        />

        {currentUserRole === "mentor" && showJobCard && (
          <div className="job-details">
            <StartupCardComp
              className={`custom-job-card-class ${
                isInPopup ? "no-border" : ""
              }`}
              jobs={[job]}
              isInPopup={isInPopup}
            />
            {showApplyButton && (
              <div className="jobButton-button_apply">
                <MyButton
                  type="button"
                  hasIcon={false}
                  name="Apply"
                  className="apply-button"
                  onClick={handleApply}
                />
              </div>
            )}
          </div>
        )}

        {currentUserRole === "startup" && showJobCard && (
          <div className="applied-mentors">
            <h3>Mentors who applied for this job:</h3>
            {mentors.length > 0 ? (
              <ul>
                {mentors.map((mentor) => (
                  <li key={mentor._id}>
                    <span className="mentor-name">{mentor.name}</span>
                    <div className="buttons-assign-reject">
                      <MyButton
                        type="button"
                        className="accept-button"
                        name="Assign"
                        onClick={() => {
                          handleAssignMentor(mentor._id, mentor.applicationId);
                        }}
                        disabled={mentor.status === "accepted"}
                      />
                      <MyButton
                        type="button"
                        className="reject-button"
                        name="Reject"
                        onClick={() => {
                          handleRejectMentor(mentor._id, mentor.applicationId);
                        }}
                        disabled={mentor.status === "rejected"}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No applicants for this job.</p>
            )}
          </div>
        )}

        <ModalCard
          show={showModal}
          message={modalMessage}
          onClose={handleModalClose}
        />
      </div>
    </div>
  );
};

export default JobPopup;
