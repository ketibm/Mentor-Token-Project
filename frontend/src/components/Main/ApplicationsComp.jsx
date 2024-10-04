import React, { useState, useEffect } from "react";
import clock from "../../assets/DashAssets/clock.svg";
import JobPopup from "../../components/Popup/JobPopup";

const ApplicationsComp = () => {
  const [applications, setApplications] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const mentorId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/apps", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Error fetching applications: ${errorData}`);
        }
        const applicationsData = await response.json();

        const applications = applicationsData.filter(
          (app) =>
            app.applicationType === "mentorToCompany" &&
            app.mentorId &&
            app.mentorId._id === mentorId
        );
        setApplications(applications);
      } catch (error) {
        console.error("Error fetching applications");
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/jobs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        console.log("Full API response:", data);

        if (Array.isArray(data)) {
          setAllJobs(data);
        }

        const uniqueCompanies = Array.from(
          new Set(data.map((job) => job.companyId.name))
        ).map((name) => ({
          name,
          id: data.find((job) => job.companyId.name === name).companyId._id,
        }));

        setCompanies(uniqueCompanies);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchApplications();
    fetchJobs();
  }, [mentorId]);

  const handleJobClick = (jobId) => {
    if (!jobId) {
      console.error("Job ID is undefined");
      return;
    }
    const job = allJobs.find((job) => job._id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsPopupVisible(true);
    } else {
      console.error("Job not found");
    }
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
    setIsPopupVisible(false);
  };

  if (!applications.length === 0) {
    return <div>No applications sent yet.</div>;
  }

  return (
    <div className="applications-bar">
      <ul>
        {applications.map((app) => (
          <li key={app._id}>
            <span onClick={() => handleJobClick(app.jobId._id)}>
              {app.jobId ? app.jobId.title : "No title available"}
            </span>
            <img src={clock} alt="clock" />
          </li>
        ))}
      </ul>

      {isPopupVisible && selectedJob && (
        <JobPopup
          jobId={selectedJob._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={false}
          appliedMentors={selectedJob.appliedMentors}
          companyId={selectedJob.companyId}
          incrementAppliedJobs={() => {}}
          isInPopup={true}
        />
      )}
    </div>
  );
};
export default ApplicationsComp;
