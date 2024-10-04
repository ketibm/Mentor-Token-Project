import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main/DropdownComp";
import AssignedJobsComp from "../../components/Main/AssignedJobsComp";
import ProfileStatsComp from "../../components/Main/ProfileStatsComp";
import PendingJobsComp from "../../components/Main/PendingJobsComp";
import search from "../../assets/DashAssets/search.svg";
import "./MentorPage.css";

const MentorPage = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const currentUserId = localStorage.getItem("currentUserId");

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
        console.log("Fetched Mentor Data:", mentorData);
        setMentor(mentorData);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      }
    };

    fetchMentorData();
  }, [mentorId]);

  const handleFilteredData = (data) => {
    setMentor(data);
  };

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

  if (!mentor) {
    return <div>Loading...</div>;
  }
  return (
    <div className="myStats-container">
      <header>
        <div>
          <SearchComp
            img={search}
            placeholder="Search Mentor..."
            data={mentor}
            onFilteredData={handleFilteredData}
          />
        </div>
        <div>
          <DropdownComp titleStyle={titleStyle} roleStyle={roleStyle} />
        </div>
      </header>
      <div className="myStats-content">
        <div className="myStats-content_one">
          <ProfileStatsComp mentorId={mentorId} />
        </div>
        <div className="myStats-content_two">
          <div>
            <h2>Assigned Jobs</h2>
            <AssignedJobsComp mentorId={mentorId} status="mentor" />
          </div>
          <div>
            <h2>Pending Job Offers</h2>
            <PendingJobsComp
              showHeader={false}
              mentorId={mentorId}
              companyId={currentUserId}
              handleCancelOffer={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPage;
