import React, { useState, useEffect } from "react";
import ProfileImageUpload from "./ProfileImageUpload";

const DropdownComp = ({ itemImg = "defaultImagePath.svg" }) => {
  const [userImage, setUserImage] = useState(itemImg);
  const [userName] = useState(
    localStorage.getItem("currentUserName") || "Default Name"
  );
  const [userRole] = useState(localStorage.getItem("currentUserRole"));
  const userId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();
        if (data.profileImage) {
          setUserImage(data.profileImage);
          localStorage.setItem("currentUserImage", data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchProfileImage();
    }
  }, [userId, itemImg]);

  return (
    <div className="dropdown">
      <div
        className="profile-image-container"
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          marginTop: "25px",
        }}
      >
        <ProfileImageUpload
          userId={userId}
          userImage={userImage}
          setUserImage={setUserImage}
        />
      </div>

      <div>
        <p style={{ fontWeight: "bold" }} className="dropdown-title">
          {userName}
          {userRole && (
            <>
              <br />
              <span
                style={{ color: "gray", fontSize: "0.9em" }}
                className="dropdown-role"
              >
                {userRole}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default DropdownComp;
