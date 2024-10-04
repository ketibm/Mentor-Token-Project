import React, { useState, useEffect } from "react";
import "./ProfileImageUpload.css";
import Default from "../../assets/About/Default.svg";

const ProfileImageUpload = ({ userId, userImage, setUserImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const defaultImagePath = Default;

  useEffect(() => {
    if (userImage) {
      setPreviewUrl(`http://localhost:8000/${userImage}`);
    } else {
      setPreviewUrl(defaultImagePath);
    }
  }, [userImage]);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      await handleSubmit(file);
    }
  };

  const handleSubmit = async (file) => {
    if (!userId) {
      alert("User ID is missing. Cannot upload image.");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${userId}/profile-image`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUserImage(result.profileImage);
        setPreviewUrl(`http://localhost:8000/${result.profileImage}`);
        setSelectedFile(null);
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const handleResetToDefault = async () => {
    try {
      const response = await fetch(defaultImagePath);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("profileImage", blob, "defaultImage.svg");

      const uploadResponse = await fetch(
        `http://localhost:8000/api/user/${userId}/profile-image`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      const result = await uploadResponse.json();

      if (uploadResponse.ok) {
        setUserImage(null);
        setPreviewUrl(defaultImagePath);
        setShowMenu(false);
      } else {
        alert(result.error || "Failed to reset to default image");
      }
    } catch (error) {
      console.error("Error resetting to default image:", error);
      alert("Error resetting to default image");
    }
  };
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleUploadImageClick = () => {
    document.getElementById("imageUpload").click();
    setShowMenu(false);
  };

  return (
    <div className="profile-image-container">
      <div className="profile-image-wrapper">
        <img
          src={previewUrl}
          alt="Upload Image"
          className="profile-image"
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            width: "70px",
            height: "70px",
            objectFit: "cover",
          }}
          onClick={toggleMenu}
        />
        {showMenu && (
          <div className="image-menu">
            <button onClick={handleUploadImageClick}>Upload Image</button>
            <button onClick={handleResetToDefault}>Reset to Default</button>
          </div>
        )}
      </div>
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default ProfileImageUpload;
