import React, { useState, useEffect } from "react";
import "./QuickOverviewComp.css";

const QuickOverviewComp = () => {
  const [isSelected, setIsSelected] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalAssignedJobs, setTotalAssignedJobs] = useState(0);
  const [jobsThatYouHaveApplied, setJobsThatYouHaveApplied] = useState(0);
  const [finishedJobs, setFinishedJobs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserId = localStorage.getItem("currentUserId");

        if (!currentUserId) {
          console.error("Mentor ID is not available.");
          return;
        }

        const applicationsResponse = await fetch(
          "http://localhost:8000/api/apps",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const jobsResponse = await fetch("http://localhost:8000/api/jobs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!applicationsResponse.ok || !jobsResponse.ok) {
          throw new Error("Error fetching applications or jobs data");
        }

        const applicationsData = (await applicationsResponse.json()) || [];

        const filteredApplications = applicationsData.filter(
          (app) => app.mentorId && app.mentorId._id === currentUserId
        );

        setTotalJobs(filteredApplications.length);

        const assignedJobs = filteredApplications.filter(
          (app) => app.status === "accepted"
        );
        setTotalAssignedJobs(assignedJobs.length);

        const appliedJobs = filteredApplications.filter(
          (app) => app.applicationType === "mentorToCompany"
        );
        setJobsThatYouHaveApplied(appliedJobs.length);

        const finishedJobs = filteredApplications.filter(
          (app) => app.acceptedStatus === "DONE"
        );
        setFinishedJobs(finishedJobs.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleQuick = (job) => {
    setIsSelected(isSelected === job ? "" : job);
  };

  return (
    <div className="quick-container">
      <h2>Quick Overview</h2>
      <ul>
        <li
          className={isSelected === "totalJobs" ? "quick-container-active" : ""}
          onClick={() => handleQuick("totalJobs")}
        >
          <p>Total Jobs</p>
          <span>{totalJobs}</span>
        </li>
        <li
          className={
            isSelected === "totalAssignedJobs" ? "quick-container-active" : ""
          }
          onClick={() => handleQuick("totalAssignedJobs")}
        >
          <p>Total Assigned Jobs</p>
          <span>{totalAssignedJobs}</span>
        </li>
        <li
          className={
            isSelected === "jobsThatYouHaveApplied"
              ? "quick-container-active"
              : ""
          }
          onClick={() => handleQuick("jobsThatYouHaveApplied")}
        >
          <p>Jobs That You Have Applied</p>
          <span>{jobsThatYouHaveApplied}</span>
        </li>
        <li
          className={
            isSelected === "finishedJobs" ? "quick-container-active" : ""
          }
          onClick={() => handleQuick("finishedJobs")}
        >
          <p>Finished Jobs</p>
          <span>{finishedJobs}</span>
        </li>
      </ul>
    </div>
  );
};

export default QuickOverviewComp;
