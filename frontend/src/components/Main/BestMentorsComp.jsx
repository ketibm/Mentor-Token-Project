import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import twoArrows from "../../assets/DashAssets/twoArrows.svg";
import twoPurpleArrows from "../../assets/DashAssets/twoPurpleArrows.svg";

const BestMentorsComp = ({ mentors }) => {
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [hoveredMentor, setHoveredMentor] = useState(null);

  const handleArrowsClick = (mentor) => {
    setSelectedMentor(mentor);
    navigate(`/mentor/${mentor._id}`);
  };

  const handleMouseEnter = (mentor) => {
    setHoveredMentor(mentor);
  };

  const handleMouseLeave = () => {
    setHoveredMentor(null);
  };

  return (
    <div className="bestMentor-list">
      <ul>
        {mentors.map((mentor) => (
          <li
            key={mentor._id}
            onMouseEnter={() => handleMouseEnter(mentor)}
            onMouseLeave={handleMouseLeave}
            onClick={() => setSelectedMentor(mentor)}
            className={selectedMentor === mentor ? "active" : ""}
          >
            <div className="mentor-info">
              <div className="mentor-image-wrapper">
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
              <div>
                <span className="mentor-name">{mentor.name}</span>
              </div>
            </div>
            <div className="mentor-info__jobs">
              <span className="mentor-info__jobs-number">
                {mentor.acceptedJobs ? mentor.acceptedJobs.length : 0}
              </span>
              <span className="mentor-info__jobs-text">Achieved Jobs</span>
            </div>
            <img
              src={
                hoveredMentor === mentor || selectedMentor === mentor
                  ? twoPurpleArrows
                  : twoArrows
              }
              alt="two arrows"
              className="twoArrows"
              onClick={() => handleArrowsClick(mentor)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestMentorsComp;
