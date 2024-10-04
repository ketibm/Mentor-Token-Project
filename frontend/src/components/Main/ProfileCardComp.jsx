import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileImageUpload from "./ProfileImageUpload";
import MyButton from "../../components/Button/MyButton";
import mail from "../../assets/DashAssets/mail.svg";
import phone from "../../assets/DashAssets/phone.svg";
import edit from "../../assets/DashAssets/edit.svg";
import close from "../../assets/DashAssets/close.svg";
import linkedinLogo from "../../assets/DashAssets/linkedinLogo.svg";
import "./ProfileCardComp.css";

const ProfileCardComp = ({ userImage, mentorId }) => {
  const [profileImage, setProfileImage] = useState(userImage);
  const [mentor, setMentor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    profileImage: "",
    name: "",
    profession: "",
    email: "",
    phone: "",
  });

  const currentUserRole = localStorage.getItem("currentUserRole");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/${mentorId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const mentorData = await response.json();
        setMentor(mentorData);
        setFormData({
          profileImage: mentorData.profileImage,
          name: mentorData.name,
          profession: mentorData.profession,
          email: mentorData.email,
          phone: mentorData.phone,
        });
        setProfileImage(mentorData.profileImage);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${mentorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },

          body: JSON.stringify({
            profileImage: formData.profileImage,
            name: formData.name,
            profession: formData.profession,
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Error updating data");
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
      setMentor(updatedMentor);
      setFormData({
        profileImage: updatedMentor.profileImage,
        name: updatedMentor.name,
        profession: updatedMentor.profession,
        email: updatedMentor.email,
        phone: updatedMentor.phone,
      });
      setProfileImage(updatedMentor.profileImage);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  if (!mentor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-card">
      <div className="profile-img-container">
        {currentUserRole === "mentor" && isEditing ? (
          <ProfileImageUpload
            userId={mentorId}
            userImage={profileImage}
            setUserImage={setProfileImage}
          />
        ) : (
          <img
            className="profile-image"
            src={
              profileImage
                ? `http://localhost:8000/${profileImage}`
                : "default-image-path.jpg"
            }
            alt="Mentor"
            style={{
              cursor: "pointer",
              width: "70px",
              height: "70px",
            }}
            onClick={currentUserRole === "mentor" ? handleEditClick : undefined}
          />
        )}
      </div>
      {currentUserRole === "mentor" ? (
        isEditing ? (
          <img
            className="closing-img"
            src={close}
            alt="Close"
            onClick={handleCloseClick}
          />
        ) : (
          <img
            className="editing-img"
            src={edit}
            alt="Edit"
            onClick={handleEditClick}
          />
        )
      ) : null}

      <div className="profile-info">
        <div className="profile-name">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          ) : (
            <h2>{mentor.name}</h2>
          )}
          <Link to="https://www.linkedin.com" target="_blank">
            <img src={linkedinLogo} alt="linkedin" />
          </Link>
        </div>
        <div className="profile-jobs">
          {isEditing ? (
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            />
          ) : (
            <p>{mentor.profession}</p>
          )}
        </div>
      </div>
      <div className="profile-contact">
        <div className="profile-email">
          <img src={mail} alt="mail" />
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          ) : (
            <span>{mentor.email}</span>
          )}
        </div>
        <div className="profile-phone">
          <img src={phone} alt="phone" />
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          ) : (
            <span>{mentor.phone}</span>
          )}
        </div>
      </div>
      {isEditing && (
        <MyButton
          className="form-group_about-button"
          hasIcon={false}
          onClick={handleSave}
          name={"Save"}
        />
      )}
    </div>
  );
};

export default ProfileCardComp;
