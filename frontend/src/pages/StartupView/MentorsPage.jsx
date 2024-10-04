import React, { useState, useEffect } from "react";
import SearchComp from "../../components/Main/SearchComp";
import DropdownComp from "../../components/Main/DropdownComp";
import MentorCardComp from "../../components/Main/MentorCardComp";
import ProfileStatsComp from "../../components/Main/ProfileStatsComp";
import QuickComp from "../../components/Main/QuickComp";
import tech from "../../assets/DashAssets/tech.svg";
import search from "../../assets/DashAssets/search.svg";
import "./StartupDashPage.css";
import "./MentorsPage.css";

const MentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  useEffect(() => {
    const fetchMentorsWithCompletedJobs = async () => {
      try {
        const mentorsResponse = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!mentorsResponse.ok) {
          throw new Error("Error fetching mentors");
        }
        const mentorsData = await mentorsResponse.json();

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
        if (!applicationsResponse.ok) {
          throw new Error("Error fetching applications");
        }
        const applicationsData = await applicationsResponse.json();
        const completedApplications = applicationsData.filter(
          (application) => application.acceptedStatus === "DONE"
        );

        const mentorsWithCompletedJobs = mentorsData
          .filter((user) => user.role === "mentor")
          .map((mentor) => {
            const completedJobsCount = completedApplications.filter(
              (application) =>
                application.mentorId._id.toString() === mentor._id.toString()
            ).length;

            return {
              ...mentor,
              completedJobsCount,
            };
          });

        const sortedMentors = mentorsWithCompletedJobs.sort(
          (a, b) => (b.completedJobsCount || 0) - (a.completedJobsCount || 0)
        );
        setMentors(sortedMentors);
      } catch (error) {
        console.error("Error fetching mentors or applications:", error);
      }
    };

    fetchMentorsWithCompletedJobs();
  }, []);

  const handleViewMentor = (mentorId) => {
    setSelectedMentorId(mentorId);
  };

  const handleFilteredData = (data) => {
    setFilteredMentors(data);
  };

  const mentorsToDisplay =
    filteredMentors.length > 0 ? filteredMentors : mentors;

  console.log("Mentors to Display:", mentorsToDisplay);

  return (
    <div className="mentor--container">
      <header>
        <div>
          <SearchComp
            img={search}
            placeholder="Search Mentor..."
            data={mentors}
            onFilteredData={handleFilteredData}
          />
        </div>
        <div>
          <DropdownComp itemImg={tech} title="TechWave Innovations" />
        </div>
      </header>
      <div className="mentor--container__content">
        <div className="content-two">
          <div>
            {selectedMentorId ? (
              <ProfileStatsComp mentorId={selectedMentorId} />
            ) : (
              <MentorCardComp
                mentors={mentorsToDisplay}
                onClick={handleViewMentor}
              />
            )}
          </div>
          <div>
            <QuickComp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
