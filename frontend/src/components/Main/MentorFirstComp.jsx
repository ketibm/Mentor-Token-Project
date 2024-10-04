import React, { useState } from "react";
import mentorImg from "../../assets/DashAssets/mentorImg.svg";
import plus from "../../assets/DashAssets/plus.svg";
import MentorPopup from "../../components/Popup/MentorPopup";
import MyButton from "../../components/Button/MyButton";
import "./MentorFirstComp.css";

const MentorFirstComp = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleOpenPopup = (e) => {
    e.preventDefault();
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="firstMentor-container">
      <div
        className={`firstMentor-content ${
          isPopupVisible ? "blur-background" : ""
        }`}
      >
        <div className="firstMentor-left">
          <h1>My Mentors</h1>
          <p>Monitor and add new mentors</p>
          <MyButton
            hasIcon={true}
            iconSrc={plus}
            name={"Add New Mentor"}
            onClick={handleOpenPopup}
          />
        </div>
        <div className="firstMentor-right">
          <img src={mentorImg} alt="mentors" />
        </div>
      </div>
      {isPopupVisible && <MentorPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default MentorFirstComp;
