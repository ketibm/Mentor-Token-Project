import React, { useState, useEffect } from "react";
// import "./AssignedJobsComp.css";

const AssignedJobsComp = ({ mentorId, status = "all" }) => {
  const [applications, setApplications] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filter, setFilter] = useState("All");

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
          throw new Error("Error fetching applications");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const filterJobs = () => {
      const filtered = applications.filter((app) => {
        const isMentorJob =
          status === "mentor" ? app.mentorId?._id === mentorId : true;
        const jobStatus = app.acceptedStatus?.toUpperCase();
        const statusFilter =
          filter === "All" ? true : jobStatus === filter.toUpperCase();

        return isMentorJob && app.status !== "pending" && statusFilter;
      });

      setFilteredJobs(filtered);
    };

    filterJobs();
  }, [filter, applications, mentorId, status]);

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
  };

  const filterButtons = () => {
    const buttonConfig = ["All", "Done", "Rejected", "In Progress"];
    return buttonConfig.map((status) => (
      <button
        key={status}
        className={filter === status ? "active" : ""}
        onClick={() => handleFilterClick(status)}
      >
        {status.replace("_", " ")}
      </button>
    ));
  };

  return (
    <div className="job-list">
      <div className="filters">{filterButtons()}</div>
      <ul>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((app) => (
            <li key={app._id}>
              <span>{app.jobId?.title || "Unknown Job"}</span>
              <span
                className={`status ${
                  app.acceptedStatus?.toLowerCase() || "unknown"
                }`}
              >
                {app.acceptedStatus || "Unknown Status"}
              </span>
            </li>
          ))
        ) : (
          <li>No jobs found</li>
        )}
      </ul>
    </div>
  );
};

export default AssignedJobsComp;
