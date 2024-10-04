import React, { useState, useEffect } from "react";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main/DropdownComp";
import StatisticsComp from "../../components/Main/StatisticsComp";
import QuickOverviewComp from "../../components/Main/QuickOverviewComp";
import JobPopup from "../../components/Popup/JobPopup";
import ProfileStatsComp from "../../components/Main/ProfileStatsComp";
import search from "../../assets/DashAssets/search.svg";
import "./MyStatsPage.css";

const MyStatsPage = () => {
  const [jobsThatYouHaveApplied, setJobsThatYouHaveApplied] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const currentUserId = localStorage.getItem("currentUserId");

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
  const incrementAppliedJobs = (jobId) => {
    setJobsThatYouHaveApplied((prevCount) => prevCount + 1);
  };

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
    <div className="myStats-container">
      <header>
        <div>
          <SearchComp
            img={search}
            placeholder="Search"
            onFilteredData={handleFilteredData}
            onJobClick={handleJobClick}
          />
        </div>
        <div>
          <DropdownComp titleStyle={titleStyle} roleStyle={roleStyle} />
        </div>
      </header>
      <div className="myStats-content">
        <h2>My Stats</h2>
        <div className="myStats-content_one">
          <ProfileStatsComp mentorId={currentUserId} />
        </div>
        <div className="myStats-content_two">
          <div>
            <h2>Performance Over Time</h2>
            <StatisticsComp />
          </div>
          <QuickOverviewComp
            incrementAppliedJobs={incrementAppliedJobs}
            mentorId={currentUserId}
          />
        </div>
      </div>
      {isPopupVisible && selectedJob && (
        <JobPopup
          jobId={selectedJob._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={true}
          appliedMentors={selectedJob.appliedMentors}
          companyId={selectedJob.companyId}
          incrementAppliedJobs={incrementAppliedJobs}
        />
      )}
    </div>
  );
};

export default MyStatsPage;
