import React, { useState, useEffect } from "react";
import ProfileCardComp from "./ProfileCardComp";
import AboutCardComp from "./AboutCardComp";
import "./ProfileStatsComp.css";

const ProfileStatsComp = ({ mentorId }) => {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");

        const response = await fetch(
          `http://localhost:8000/api/user/${mentorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Error fetching profile data");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [mentorId]);

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profileStats-container">
      <ProfileCardComp mentorId={mentorId} profileData={profileData} />
      <AboutCardComp mentorId={mentorId} profileData={profileData} />
    </div>
  );
};

export default ProfileStatsComp;
