import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SkillsComp from "./SkillsComp";
import edit from "../../assets/DashAssets/edit.svg";
import close from "../../assets/DashAssets/close.svg";
import plus from "../../assets/DashAssets/plus.svg";
import OfferJobPopup from "../../components/Popup/OfferJobPopup";
import MyButton from "../../components/Button/MyButton";
import "./AboutCardComp.css";

const AboutCardComp = ({ mentorId }) => {
  const [mentor, setMentor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    skills: [],
    desc: "",
  });

  const location = useLocation();
  const isMentorRoute = location.pathname.includes("/mentor");

  useEffect(() => {
    const fetchData = async () => {
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
          throw new Error("Error fetching data");
        }
        const mentorData = await response.json();
        setMentor(mentorData);
        setFormData({
          skills: Array.isArray(mentorData.skills)
            ? mentorData.skills.map((skill) => ({ value: skill, label: skill }))
            : [],
          desc: mentorData.desc,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [mentorId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
  };

  const handleOfferJobClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (selectedOptions) => {
    console.log("Selected skills in handleSkillsChange:", selectedOptions);
    setFormData((prevData) => ({
      ...prevData,

      skills: Array.isArray(selectedOptions) ? selectedOptions : [],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const skillsData = Array.isArray(formData.skills)
        ? formData.skills.map((skill) => skill.value || skill)
        : [];

      const response = await fetch(
        `http://localhost:8000/api/user/${mentorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: skillsData,
            desc: formData.desc,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving data");
      }

      const fetchResponse = await fetch(
        `http://localhost:8000/api/user/${mentorId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!fetchResponse.ok) {
        throw new Error("Error fetching updated data");
      }

      const updatedMentor = await fetchResponse.json();
      if (!Array.isArray(updatedMentor.skills)) {
        throw new Error("Updated mentor skills are not in expected format");
      }
      setMentor(updatedMentor);
      setFormData({
        skills: updatedMentor.skills.map((skill) => ({
          value: skill,
          label: skill,
        })),
        desc: updatedMentor.desc,
      });
      setMentor(updatedMentor);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  if (!mentor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="about-card">
      <div className="about-header">
        <h2>About</h2>

        {isMentorRoute ? (
          <MyButton
            className="offerNewJob-button"
            hasIcon={true}
            iconSrc={plus}
            name={"Offer New Job"}
            onClick={handleOfferJobClick}
          />
        ) : isEditing ? (
          <img src={close} alt="Close" onClick={handleCloseClick} />
        ) : (
          <img src={edit} alt="Edit" onClick={handleEditClick} />
        )}
      </div>
      <div className="about-content">
        {isEditing ? (
          <div className="about-description">
            <div className="form-group_about">
              <label htmlFor="skills">Skills:</label>
              <div className="about-content_skills">
                <SkillsComp
                  selectedSkills={formData.skills}
                  handleSkillsChange={handleSkillsChange}
                />
              </div>
            </div>
            <div className="form-group_about">
              <label htmlFor="desc">Description:</label>
              <textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <MyButton
              className="form-group_about-button"
              hasIcon={false}
              onClick={handleSave}
              name={"Save"}
            />
          </div>
        ) : (
          <div className="about-content_page">
            <p>Skills: {mentor.skills.join(" | ")}</p>
            <span>{mentor.desc}</span>
          </div>
        )}
      </div>
      {isPopupOpen && <OfferJobPopup onClose={handlePopupClose} />}
    </div>
  );
};

export default AboutCardComp;
