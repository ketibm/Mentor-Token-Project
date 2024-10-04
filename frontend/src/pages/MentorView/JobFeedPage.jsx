import React, { useState, useEffect } from "react";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main/DropdownComp";
import JobFeedStartup from "../../components/Modal/JobFeedStartup";
import JobPopup from "../../components/Popup/JobPopup";
import JobFeed from "../../components/Modal/JobFeed";
import search from "../../assets/DashAssets/search.svg";
import "./JobFeedPage.css";

const JobFeedPage = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("a-z");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("cards");
  const [allJobs, setAllJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const currentUserRole = localStorage.getItem("currentUserRole");

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

    fetchJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
    setIsPopupVisible(false);
  };

  const handleFilteredData = (filteredData) => {
    console.log("Filtered Data:", filteredData);
  };

  const filteredJobs = selectedCompany
    ? allJobs.filter(
        (job) => String(job.companyId._id) === String(selectedCompany)
      )
    : allJobs;

  console.log(
    "Job Company IDs:",
    allJobs.map((job) => job.companyId._id)
  );
  const incrementAppliedJobs = () => {
    setAppliedJobsCount((prevCount) => prevCount + 1);
  };

  return (
    <div className={`jobFeed--container ${isPopupVisible ? "dimmed" : ""}`}>
      <header className="jobFeed-drop">
        <div className="jobFeed-search">
          <SearchComp
            img={search}
            placeholder="Search"
            onFilteredData={handleFilteredData}
            onJobClick={handleJobClick}
          />
        </div>
        <div>
          <DropdownComp
            role={currentUserRole}
            titleStyle={titleStyle}
            roleStyle={roleStyle}
          />
        </div>
      </header>
      <div>
        <JobFeedStartup
          setSortedOrder={setSortOrder}
          setCategory={setCategory}
          setFilter={setFilter}
          setSelectedCompany={setSelectedCompany}
          companyList={companies}
        />
      </div>
      <div className="jobFeed-content">
        <JobFeed
          setPopupVisibility={setIsPopupVisible}
          sortOrder={sortOrder}
          role={currentUserRole}
          category={category}
          allJobs={filteredJobs}
          filter={filter}
          selectedCompany={selectedCompany}
          onJobClick={handleJobClick}
        />
      </div>
      {isPopupVisible && selectedJob && (
        <JobPopup
          jobId={selectedJob._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={true}
          appliedMentors={selectedJob.appliedMentors}
          companyId={selectedJob.company._id}
          incrementAppliedJobs={incrementAppliedJobs}
        />
      )}
    </div>
  );
};

export default JobFeedPage;
