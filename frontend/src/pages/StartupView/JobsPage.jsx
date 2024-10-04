import React, { useState, useEffect } from "react";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main/DropdownComp";
import StartupCardComp from "../../components/Main/StartupCardComp";
import JobPopup from "../../components/Popup/JobPopup";
import tech from "../../assets/DashAssets/tech.svg";
import search from "../../assets/DashAssets/search.svg";
import plus from "../../assets/DashAssets/plus.svg";
import MyButton from "../../components/Button/MyButton";
import JobModal from "../../components/Modal/JobModal";
import "./JobsPage.css";

const JobsPage = ({ setPopupVisibility, userRole }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [modalType, setModalType] = useState(null);
  const companyId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/jobs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        const allJobs = await response.json();
        const filteredJobs = allJobs.filter(
          (job) => job.companyId._id === companyId
        );
        setJobs(filteredJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (companyId) {
      fetchJobs();
    }
  }, [companyId]);

  const handleCreateJobClick = () => {
    setModalType("create");
    setShowModal(true);
  };

  const handleOpenPopup = (job) => {
    console.log("Opening popup with job:", job);
    setSelectedJob(job);
    setPopupVisibility(true);
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
    setPopupVisibility(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFilteredData = (data) => {
    setFilteredData(data);
  };

  const handleJobClick = (jobId) => {
    console.log("Job clicked:", jobId);
  };

  return (
    <div className="jobs--container">
      <header>
        <SearchComp
          img={search}
          placeholder="Search Mentor..."
          onFilteredData={handleFilteredData}
        />
        <DropdownComp itemImg={tech} />
      </header>
      <div className="jobs--container_button">
        <h1>Your Startup Jobs</h1>
        <MyButton
          type="button"
          hasIcon={true}
          iconSrc={plus}
          name="Create New Job"
          onClick={handleCreateJobClick}
          className="create-job-button"
        />
      </div>
      <div className="jobFeed-content">
        <StartupCardComp
          jobs={jobs}
          onClick={handleJobClick}
          showApplyButton={false}
          role={userRole}
        />
      </div>
      {selectedJob && (
        <JobPopup
          jobId={selectedJob._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={userRole === "mentor"}
          // appliedMentors={selectedJob.appliedMentors}
          appliedMentors={selectedJob.appliedMentors || []}
          companyId={companyId}
        />
      )}
      {showModal && (
        <JobModal onClose={handleCloseModal} modalType={modalType} />
      )}
    </div>
  );
};

export default JobsPage;
