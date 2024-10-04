import React, { useState, useEffect } from "react";
import MyButton from "../../components/Button/MyButton";
import JobPopup from "../Popup/JobPopup";

const PendingJobsComp = ({
  showHeader,
  mentorId,
  companyId,
  handleCancelOffer: externalHandleCancelOffer,
}) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const jobsResponse = await fetch("http://localhost:8000/api/jobs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!jobsResponse.ok) {
          throw new Error(`Failed to fetch jobs: ${jobsResponse.statusText}`);
        }
        const jobsResult = await jobsResponse.json();
        console.log("Fetched jobs:", jobsResult);
        setJobs(jobsResult);

        const appsResponse = await fetch("http://localhost:8000/api/apps", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!appsResponse.ok) {
          throw new Error(
            `Failed to fetch applications: ${appsResponse.statusText}`
          );
        }
        const appResult = await appsResponse.json();
        console.log("Fetched applications:", appResult);
        setApplications(appResult);
      } catch (error) {
        console.error("Failed to fetch jobs or applications:", error);
      }
    };

    fetchJobsAndApplications();
  }, [mentorId]);

  useEffect(() => {
    if (jobs.length > 0 && applications.length > 0) {
      const filteredJobs = jobs.filter((job) => job.status === "Direct");
      const jobStatusToId = {};
      const jobIdToTitle = {};
      filteredJobs.forEach((job) => {
        jobStatusToId[job._id] = job.status;
        jobIdToTitle[job._id] = job.title;
      });

      const filteredApplications = applications.filter((app) => {
        return (
          app.status === "pending" &&
          (currentUserRole === "startup"
            ? app.mentorId &&
              app.mentorId._id === mentorId &&
              app.companyId &&
              app.companyId._id === companyId
            : currentUserRole === "mentor"
            ? app.mentorId && app.mentorId._id === mentorId
            : false)
        );
      });

      const updatedPendingJobs = filteredApplications
        .map((app) => {
          const jobStatus = jobStatusToId[app.jobId?._id] || "Unknown Status";
          const jobTitle = jobIdToTitle[app.jobId?._id] || "Unknown Title";

          return {
            _id: app._id,
            status: app.status,
            jobStatus,
            jobTitle,
            jobId: app.jobId?._id,
          };
        })
        .filter((job) => job.jobStatus === "Direct");
      console.log("Updated pending jobs:", updatedPendingJobs);
      setPendingJobs(updatedPendingJobs);
    }
  }, [jobs, applications, mentorId, companyId, currentUserRole]);

  const handleJobClick = (jobId) => {
    const job = pendingJobs.find((job) => job.jobId === jobId);
    if (job) {
      const fullJob = jobs.find((j) => j._id === job.jobId);
      if (fullJob) {
        console.log("Full job details:", fullJob);
        setSelectedJob(fullJob);
      }
    } else {
      console.error("Job not found in pending jobs:", jobId);
    }
  };

  const handleCloseJobCard = () => {
    setSelectedJob(null);
  };

  const handleAccept = async (appId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/app/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          status: "accepted",
          acceptedStatus: "IN PROGRESS",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      const updatedApp = await response.json();

      setPendingJobs((prev) => prev.filter((job) => job._id !== appId));
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleReject = async (appId) => {
    try {
      console.log("Rejecting application with ID:", appId);
      const response = await fetch(`http://localhost:8000/api/app/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          status: "rejected",
          acceptedStatus: "REJECTED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      setPendingJobs((prev) => prev.filter((job) => job._id !== appId));
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  const handleCancelOffer = async (appId) => {
    try {
      const app = applications.find((app) => app._id === appId);
      if (!app) {
        console.error("Application not found for this ID", { appId });
        return;
      }

      if (!app.jobId || !app.jobId._id) {
        console.error("Invalid jobId for this application", { app });
        return;
      }

      const responseApp = await fetch(
        `http://localhost:8000/api/app/${appId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (!responseApp.ok) {
        throw new Error("Failed to delete application");
      }

      console.log("Application successfully canceled");

      const jobResponse = await fetch(
        `http://localhost:8000/api/job/${app.jobId._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (!jobResponse.ok) {
        throw new Error("Failed to delete job");
      }

      console.log("Job successfully canceled");

      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== appId)
      );
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== app.jobId));
    } catch (error) {
      console.error("Error canceling offer:", error);
    }
  };

  return (
    <div className="pending-jobs">
      {showHeader}
      {pendingJobs.length > 0 ? (
        <ul>
          {pendingJobs.map((job) => (
            <li key={job._id}>
              <span
                onClick={
                  currentUserRole === "mentor"
                    ? () => handleJobClick(job.jobId)
                    : null
                }
              >
                {job.jobTitle}
              </span>

              <div className="button-container">
                {showHeader ? (
                  <>
                    <MyButton
                      name="Accept"
                      onClick={() => handleAccept(job._id)}
                      className="accept-button"
                    />
                    <MyButton
                      name="Reject"
                      onClick={() => handleReject(job._id)}
                      className="reject-button"
                    />
                  </>
                ) : (
                  <MyButton
                    name="Cancel Offer"
                    onClick={() => handleCancelOffer(job._id)}
                    className="reject-button"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span>No pending jobs available</span>
      )}

      {selectedJob && (
        <div className="job-card-modal">
          <JobPopup
            jobId={selectedJob?._id}
            job={selectedJob}
            showApplyButton={false}
            onClose={handleCloseJobCard}
            isInPopup={true}
          />
        </div>
      )}
    </div>
  );
};

export default PendingJobsComp;
