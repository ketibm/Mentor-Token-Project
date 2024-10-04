import React, { useState, useEffect } from "react";
import "./QuickComp.css";

const QuickComp = ({}) => {
  const [isSelected, setIsSelected] = useState("");
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalAssignedJobs, setTotalAssignedJobs] = useState(0);
  const [finishedJobs, setFinishedJobs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const usersResponse = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });

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

        if (!usersResponse.ok || !applicationsResponse.ok || !jobsResponse.ok) {
          throw new Error("Error fetching data");
        }

        const usersData = await usersResponse.json();
        const applicationsData = await applicationsResponse.json();
        const jobsData = await jobsResponse.json();

        if (
          !Array.isArray(usersData) ||
          !Array.isArray(applicationsData) ||
          !Array.isArray(jobsData)
        ) {
          throw new Error("Invalid data format received from server");
        }

        const mentors = usersData.filter((user) => {
          if (user.role === "mentor" && user.createdAt) {
            const createdDate = new Date(user.createdAt);
            return createdDate >= oneMonthAgo;
          }
          return false;
        });
        setTotalMentors(mentors.length);

        const acceptedApplications = applicationsData.filter((app) => {
          const appDate = new Date(app.createdAt);
          return app.status === "accepted" && appDate >= oneMonthAgo;
        });
        setTotalAssignedJobs(acceptedApplications.length);

        const finishedApplications = applicationsData.filter((app) => {
          const appDate = new Date(app.createdAt);
          return app.acceptedStatus === "DONE" && appDate >= oneMonthAgo;
        });
        setFinishedJobs(finishedApplications.length);
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
      <div className="quick-header">
        <h1>Quick Overview</h1>
        <p>In the last month</p>
      </div>
      <ul>
        <li
          className={
            isSelected === "totalMentors" ? "quick-container-active" : ""
          }
          onClick={() => handleQuick("totalMentors")}
        >
          <p>Total Mentors</p>
          <span>{totalMentors}</span>
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

export default QuickComp;
