import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import startup from "../../assets/LogIn/startup.svg";
import redStar from "../../assets/LogIn/redStar.svg";
import checked from "../../assets/LogIn/checked.svg";
import photo from "../../assets/LogIn/photo.svg";
import Default from "../../assets/About/Default.svg";
import Rectangle from "../../assets/LogIn/Rectangle.png";
import MyButton from "../../components/Button/MyButton";
import LoginComp from "../../components/Login/LoginComp";
import "./RegisterStartup.css";

const RegisterStartup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    representative: "",
    address: "",
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
    const { name, email, password, phone, representative, address } = formData;
    return (
      name &&
      email &&
      password &&
      phone &&
      representative &&
      address &&
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
      payload.append(key, value);
    });

    if (userImage) {
      payload.append("profileImage", userImage);
    } else {
      const defaultImageBlob = await fetch(Default).then((res) => res.blob());
      payload.append("profileImage", defaultImageBlob, "default.svg");
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/register/startup",
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
      navigate("/dash-s");
    } catch (error) {
      console.error("Error during registration:", error.message);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="startup--page">
      <LoginComp />
      <div className="startup--page__form">
        <h1>SETUP STARTUP ACCOUNT</h1>
        <div className="photo-mentor">
          {userImage ? (
            <img
              className="mentor--img"
              src={userImage ? URL.createObjectURL(userImage) : startup}
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
          <label className="startup--form__label" htmlFor="text">
            Startup Name
            <img src={redStar} />
          </label>
          <input
            className="startup--form__frame"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="My Startup Name"
          />
          <label className="startup--form__label" htmlFor="email">
            Email
            <img src={redStar} />
          </label>
          <input
            className="startup--form__frame"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="mentortoken@gmail.com"
            autoComplete="username"
          />
          <label className="startup--form__label" htmlFor="password">
            Password
            <img src={redStar} />
          </label>
          <input
            className="startup--form__frame"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="new-password"
          />
          <label className="startup--form__label" htmlFor="phone">
            Phone Number
            <img src={redStar} />
          </label>
          <input
            className="startup--form__frame"
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
          />
          <label className="startup--form__label" htmlFor="text">
            Legal Representative <img src={redStar} />
          </label>

          <input
            className="startup--form__frame"
            type="text"
            id="representative"
            name="representative"
            value={formData.representative}
            onChange={handleInputChange}
            placeholder="Legal Representative"
            required
          />
          <label className="startup--form__label" htmlFor="text">
            Registered Business Address
            <img src={redStar} />
          </label>
          <input
            className="startup--form__frame"
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Registered Business Address"
            required
          />

          <MyButton
            type="submit"
            hasIcon={false}
            name={"Register"}
            className="startup--form__button"
          />

          {error && (
            <p className="error-message">
              Please fill out all required fields and accept the Terms of Use &
              Privacy Policy.
            </p>
          )}
          <div className="startup--form__policy" onClick={toggleCheck}>
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

export default RegisterStartup;
