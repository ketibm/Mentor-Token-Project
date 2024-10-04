import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyButton from "../../components/Button/MyButton";
import LoginComp from "../../components/Login/LoginComp";
import SkillsComp from "../../components/Main/SkillsComp";
import Rectangle from "../../assets/LogIn/Rectangle.png";
import redStar from "../../assets/LogIn/redStar.svg";
import checked from "../../assets/LogIn/checked.svg";
import startup from "../../assets/LogIn/startup.svg";
import photo from "../../assets/LogIn/photo.svg";
import Default from "../../assets/About/Default.svg";
import "./RegisterMentor.css";

const RegisterMentor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    profession: "",
    skills: [],
    desc: "",
    profileImage: null,
  });

  const [userImage, setUserImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      skills: selectedOptions,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    return (
      formData.name &&
      formData.phone &&
      formData.email &&
      formData.profession &&
      formData.desc &&
      formData.skills.length &&
      isChecked
    );
  };

  const toggleCheck = () => {
    setIsChecked((prev) => !prev);
  };

  const sendWelcomeEmail = async (userData) => {
    try {
      const response = await fetch("http://localhost:8000/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "acceptedJobs" && value.length > 0) {
        value.forEach((item) => payload.append(`${key}[]`, item));
      } else {
        payload.append(key, value);
      }
    });

    if (userImage) {
      payload.append("profileImage", userImage);
    } else {
      const defaultImageBlob = await fetch(Default).then((res) => res.blob());
      payload.append("profileImage", defaultImageBlob, "default.svg");
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/register/mentor",
        {
          method: "POST",
          body: payload,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Registration failed");
      }

      const result = await response.json();
      console.log("Registration successful:", result);

      sendWelcomeEmail({ email: formData.email, name: formData.name });
      navigate("/dash-m");
    } catch (error) {
      console.error(error.message);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="mentor--page">
      <LoginComp />
      <div className="mentor--page__form">
        <h1>SETUP MENTOR ACCOUNT</h1>
        <div className="photo-mentor">
          {userImage ? (
            <img
              className="mentor--img"
              src={userImage ? URL.createObjectURL(userImage) : mentor}
              alt="Uploaded"
            />
          ) : (
            <img className="mentor--img" src={startup} alt="Default startup" />
          )}
          <label className="photo--mentor" htmlFor="imageUpload">
            <img src={photo} alt="Upload" />
          </label>
          <input
            type="file"
            id="imageUpload"
            style={{ display: "none" }}
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mentor--form__label" htmlFor="text">
            Mentor Name
            <img src={redStar} />
          </label>
          <input
            className="mentor--form__frame"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Mentor Name"
          />
          <label className="mentor--form__label" htmlFor="email">
            Email
            <img src={redStar} alt="required" />
          </label>
          <input
            className="mentor--form__frame"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="mentortoken@gmail"
            autoComplete="username"
          />
          <label className="mentor--form__label" htmlFor="password">
            Password
            <img src={redStar} alt="required" />
          </label>
          <input
            className="mentor--form__frame"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="password"
          />
          <label className="mentor--form__label" htmlFor="phone">
            Phone Number
            <img src={redStar} />
          </label>
          <input
            className="mentor--form__frame"
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
          />
          <label className="mentor--form__label" htmlFor="profession">
            Profession
          </label>
          <input
            className="mentor--form__frame"
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            placeholder="Profession"
            required
          />

          <SkillsComp
            className="skills-container"
            selectedSkills={formData.skills}
            handleSkillsChange={handleSkillsChange}
          />

          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <MyButton
            type="submit"
            hasIcon={false}
            name={"Register"}
            className="mentor--form__button"
          />
          {error && (
            <p className="error-message">
              Please fill out all required fields and accept the Terms of Use &
              Privacy Policy.
            </p>
          )}
          <div className="mentor--form__policy" onClick={toggleCheck}>
            <p>
              <span className="checkbox-container">
                <img src={Rectangle} alt="checkbox" />
                {isChecked && (
                  <img src={checked} alt="checked" className="check-icon" />
                )}
              </span>
              By signing up to create an account I accept Company’s Terms of use
              & Privacy Policy.
              <Link to={"/terms"}>
                <span>Terms of use & Privacy Policy.</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMentor;
