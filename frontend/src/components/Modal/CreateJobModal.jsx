import React, { useState } from "react";
import MyButton from "../../components/Button/MyButton";
import SkillsComp from "../../components/Main/SkillsComp";
import close from "../../assets/DashAssets/close.svg";
import "./CreateJobModal.css";

const CreateJobModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    skills: [],
    category: "",
    jobStatus: "Open",
  });

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

  const handleSkillsChange = (selectedOptions) => {
    console.log("Selected skills in handleSkillsChange:", selectedOptions);
    setFormData((prevData) => ({
      ...prevData,
      skills: selectedOptions,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "jobStatus" && value.toLowerCase() === "open" ? "Open" : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create New Job</h2>
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

          <MyButton
            type="button"
            hasIcon={false}
            name="Create New Job"
            className="create-job-button"
          />
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

export default CreateJobModal;
