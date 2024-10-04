import React, { useState } from "react";
import MyButton from "../../components/Button/MyButton";
import SkillsComp from "../../components/Main/SkillsComp";
import close from "../../assets/DashAssets/close.svg";
import "./JobModal.css";

const JobModal = ({ onClose, modalType }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    skills: [],
    category: "",
  });

  const [jobStatus, setJobStatus] = useState("Open");
  const categories = ["IT", "Marketing", "Finance", "Management", "HR"];
  const currentUserId = localStorage.getItem("currentUserId");

  const truncateDesc = (description) => {
    if (!description) return "No description provided";
    const maxLength = 200;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  const truncateSkills = (skills) => {
    if (!skills || skills.length === 0) return "No skills specified";
    const maxLength = 100;
    return skills.length > maxLength
      ? `${skills.substring(0, maxLength)}...`
      : skills;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedSkills = formData.skills.map((skill) => skill.value);
    const truncatedDesc = truncateDesc(formData.jobDescription);
    const truncatedSkills = truncateSkills(formattedSkills);

    try {
      const response = await fetch("http://localhost:8000/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          jobDescription: truncatedDesc,
          skills: truncatedSkills,
          jobStatus,
          companyId: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      onClose();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
    }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: selectedOptions,
    }));
  };

  const handleCreateNewJobClick = (e) => {
    setJobStatus("Open");
    handleFormSubmit(e);
  };

  const handleSendJobOfferClick = (e) => {
    setJobStatus("Direct");
    handleFormSubmit(e);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleFormSubmit}>
          <div className="modal-group">
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-group">
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-group">
            <label htmlFor="skillsRequired">Skills Required:</label>
            <SkillsComp
              selectedSkills={formData.skills}
              handleSkillsChange={handleSkillsChange}
            />
          </div>
          <div className="modal-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {modalType === "create" ? (
            <MyButton
              className="form-group_button"
              name="Create New Job"
              onClick={handleCreateNewJobClick}
            />
          ) : (
            <MyButton
              className="form-group_button"
              name="Send Job Offer"
              onClick={handleSendJobOfferClick}
            />
          )}

          <img
            src={close}
            alt="close"
            className="close-btn"
            onClick={onClose}
          />
        </form>
      </div>
    </div>
  );
};

export default JobModal;
