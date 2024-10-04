import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MyButton from "../../components/Button/MyButton";
import SkillsComp from "../../components/Main/SkillsComp";
import close from "../../assets/DashAssets/close.svg";
// import "./OfferJobPopup.css";
import "../Modal/CreateJobModal.css";

const OfferJobPopup = ({ onClose }) => {
  const { mentorId } = useParams();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    skills: [],
    category: "",
    jobStatus: "Direct",
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

  const createJob = async () => {
    const formattedSkills = formData.skills.map((skill) => skill.value);
    const truncatedDesc = truncateDesc(formData.jobDescription);
    const truncatedSkills = truncateSkills(formattedSkills);

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
      const errorText = await response.text();
      throw new Error(`Failed to create job: ${errorText}`);
    }

    const result = await response.json();
    return result.job._id;
  };

  const createApplication = async (jobId) => {
    try {
      const response = await fetch("http://localhost:8000/api/app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          jobId,
          mentorId,
          companyId: currentUserId,
          applicationType: "companyToMentor",
          status: "pending",
          acceptedStatus: "IN PROGRESS",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create application: ${errorText}`);
      }

      const result = await response.json();
      console.log("Application created:", result);
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobId = await createJob();
      if (jobId) {
        await createApplication(jobId);
        console.log("Job created successfully with ID:", jobId);
        onClose();
      } else {
        console.error("Failed to create job, no job ID returned.");
      }
    } catch (error) {
      console.error("Error creating job or application:", error);
    }
  };

  const handleSkillsChange = (selectedOptions) => {
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
        <h2>Offer Job</h2>
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
            name="Send Job Offer"
            className="create-job-button"
            onClick={handleFormSubmit}
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

export default OfferJobPopup;
