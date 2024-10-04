import React, { useState, useEffect } from "react";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main//DropdownComp";
import JobPopup from "../../components/Popup/JobPopup";
import AssignedJobsComp from "../../components/Main/AssignedJobsComp";
import PendingJobsComp from "../../components/Main/PendingJobsComp";
import ApplicationsComp from "../../components/Main/ApplicationsComp";
import search from "../../assets/DashAssets/search.svg";
import "./MentorDashPage.css";

const MentorDashPage = ({ incrementAppliedJobs, companyId }) => {
  const mentorId = localStorage.getItem("currentUserId");
  const [mentor, setMentor] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const titleStyle = {
    color: "rgba(86, 106, 127, 1)",
    fontSize: "16px",
    fontWeight: "600",
  };

  const roleStyle = {
    color: "rgba(185, 184, 188, 1)",
    fontSize: "15px",
    fontWeight: "500",
  };

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/${mentorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error fetching mentor data");
        }
        const mentorData = await response.json();
        setMentor(mentorData);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      }
    };
    fetchMentorData();
  }, [mentorId]);

  if (!mentor) {
    return <div>Loading...</div>;
  }

  const handleFilteredData = (filteredData) => {
    console.log("Filtered Data:", filteredData);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
    setIsPopupVisible(false);
  };

  return (
    <div className={`dashboard ${isPopupVisible ? "popup-open" : ""}`}>
      <header>
        <div className="left-panel">
          <SearchComp
            img={search}
            placeholder="Search"
            onFilteredData={handleFilteredData}
            onJobClick={handleJobClick}
          />
        </div>
        <div className="right-panel">
          <DropdownComp
            titleStyle={titleStyle}
            roleStyle={roleStyle}
            userId={mentorId}
          />
        </div>
      </header>
      <div className="content">
        <div className="left-panel">
          <h2>Assigned Jobs</h2>
          <AssignedJobsComp mentorId={mentorId} status="mentor" />
        </div>
        <div className="right-panel">
          <h2>Pending Jobs</h2>
          <p>Jobs offered from startup</p>
          <PendingJobsComp
            className="pending"
            showHeader={true}
            mentorId={mentorId}
            companyId={companyId}
            handleAccept={() => {}}
            handleReject={() => {}}
            onJobSelect={handleJobClick}
          />
          <br />
          <h2>Applications sent</h2>
          <p>Jobs you have applied to</p>
          <ApplicationsComp mentorId={mentorId} />
        </div>
      </div>
      {isPopupVisible && selectedJob && (
        <JobPopup
          jobId={selectedJob?._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={true}
          appliedMentors={selectedJob.appliedMentors}
          companyId={selectedJob.companyId._id}
          incrementAppliedJobs={incrementAppliedJobs}
        />
      )}
    </div>
  );
};

export default MentorDashPage;
