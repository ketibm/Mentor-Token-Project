import React, { useState, useEffect } from "react";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main/DropdownComp";
import AssignedJobsComp from "../../components/Main/AssignedJobsComp";
import BestMentorsComp from "../../components/Main/BestMentorsComp";
import StatisticsComp from "../../components/Main/StatisticsComp";
import search from "../../assets/DashAssets/search.svg";
import "./StartupDashPage.css";

const StartupDashPage = () => {
  const user = localStorage.getItem("currentUserId");
  const [allMentors, setAllMentors] = useState([]);
  const [bestMentors, setBestMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);

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
    const fetchMentors = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const mentors = data.filter((user) => user.role === "mentor");

        const sortedMentors = mentors
          .sort(
            (a, b) =>
              (b.acceptedJobs ? b.acceptedJobs.length : 0) -
              (a.acceptedJobs ? a.acceptedJobs.length : 0)
          )
          .slice(0, 3);

        setAllMentors(mentors);
        setBestMentors(sortedMentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  const handleFilteredData = (data) => {
    setFilteredMentors(data);
  };

  const handleImageUpload = (event) => {
    // Handle image upload logic...
  };

  return (
    <div className="dashboard">
      <header>
        <div className="left-panel">
          <SearchComp
            img={search}
            placeholder="Search Mentor..."
            data={allMentors}
            onFilteredData={handleFilteredData}
          />
        </div>
        <div className="right-panel">
          <DropdownComp
            titleStyle={titleStyle}
            roleStyle={roleStyle}
            userId={user}
          />
        </div>
      </header>
      <div className="content">
        <div className="left-panel">
          <h2>Assigned Jobs</h2>
          <AssignedJobsComp status="all" />
        </div>
        <div className="right-panel">
          <h2>Best Performing Mentors</h2>
          <div>
            <BestMentorsComp mentors={bestMentors} />
          </div>
          <h5>OVERALL STATISTIC</h5>
          <StatisticsComp />
        </div>
      </div>
    </div>
  );
};

export default StartupDashPage;
