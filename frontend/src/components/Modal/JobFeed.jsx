import React, { useMemo, useState } from "react";
import StartupCardComp from "../../components/Main/StartupCardComp";
import "./JobFeed.css";

const JobFeed = ({
  setPopupVisibility,
  sortOrder,
  category,
  allJobs,
  currentUserRole,
  selectedCompany,
}) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const filteredSortedJobs = useMemo(() => {
    if (!Array.isArray(allJobs)) return [];

    let filteredJobs = allJobs.filter((job) => job.status === "Open");

    if (category && category !== "all") {
      filteredJobs = filteredJobs.filter((job) =>
        job.category
          ? job.category.toLowerCase() === category.toLowerCase()
          : false
      );
    }

    if (selectedCompany && selectedCompany !== "") {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.companyId &&
          job.companyId.name
            .toLowerCase()
            .includes(selectedCompany.toLowerCase())
      );
    }

    switch (sortOrder) {
      case "newest":
        return filteredJobs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return filteredJobs.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "a-z":
        return filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return filteredJobs.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return filteredJobs;
    }
  }, [category, sortOrder, allJobs, selectedCompany]);

  const handleOpenPopup = (jobId) => {
    const job = filteredSortedJobs.find((job) => job._id === jobId);
    setSelectedJob(job);
    setIsPopupVisible(true);
    setPopupVisibility(true);
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
    setIsPopupVisible(false);
    setPopupVisibility(false);
  };

  const incrementAppliedJobs = () => {
    setAppliedJobsCount((prevCount) => prevCount + 1);
  };

  return (
    <div className={`jobFeed--container ${isPopupVisible ? "dimmed" : ""}`}>
      {isPopupVisible && (
        <div className="popup-overlay" onClick={handleClosePopup}></div>
      )}

      {filteredSortedJobs.length > 0 ? (
        <StartupCardComp
          jobs={filteredSortedJobs}
          onClick={handleOpenPopup}
          showApplyButton={currentUserRole === "mentor"}
          role={currentUserRole}
        />
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default JobFeed;
