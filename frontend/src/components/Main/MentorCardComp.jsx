import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyButton from "../../components/Button/MyButton";
import linkedinLogo from "../../assets/DashAssets/linkedinLogo.svg";
import "./MentorCardComp.css";

const MentorCardComp = ({ mentors, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (mentor) => {
    navigate(`/mentor/${mentor._id}`);
  };

  const truncateDesc = (description) => {
    const maxLength = 70;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  if (!Array.isArray(mentors)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mentorCardContainer">
      {mentors.length === 0 ? (
        <div>No mentors available</div>
      ) : (
        mentors.map((mentor) => (
          <div key={mentor._id} className="mentorCard">
            <div className="mentorCard-container">
              <div className="mentorCard-title">
                <img
                  src={
                    mentor.profileImage
                      ? `http://localhost:8000/${mentor.profileImage}`
                      : "/path/to/default/image.jpg"
                  }
                  alt={mentor.name}
                  className="mentor-image"
                />
              </div>
              <div className="mentorCard-content">
                <h3>
                  {mentor.name}
                  <Link
                    to="https://www.linkedin.com"
                    target="_blank"
                    className="linkedin-link"
                  >
                    <img src={linkedinLogo} alt="LinkedIn" />
                  </Link>
                </h3>

                <p>{mentor.skills.slice(0, 3).join(" | ")} </p>

                <span>{truncateDesc(mentor.desc)}</span>
              </div>
            </div>
            <div className="mentorCard-button">
              <MyButton
                name="View Mentor"
                onClick={() => handleClick(mentor)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MentorCardComp;
