import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/Button/MyButton";
import LoginComp from "../../components/Login/LoginComp";
import ModalCard from "../../components/Modal/ModalCard";
import "../Register/RegisterPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      const requestBody = { email: email };
      console.log("Request Body:", requestBody);
      const response = await fetch(
        "http://localhost:8000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email.");
      }

      setModalMessage(
        "An email has been sent with instructions to reset your password."
      );
      setModalVisible(true);
    } catch (error) {
      setError(error.message);
      console.error("Error sending reset password email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    await requestPasswordReset(email);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigate("/login");
  };

  return (
    <div className="register--page">
      <LoginComp />
      <div className="register--page__form">
        <div>
          <h2>Forgot Password</h2>
          <p className="reset-info-message">Enter your email address</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="register--form__label" htmlFor="email">
            Email
          </label>
          <input
            className="register--form__password"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            autoComplete="email"
            required
          />
          {error && <p className="error-message">{error}</p>}{" "}
          <MyButton
            type="submit"
            hasIcon={false}
            name={loading ? "Sending..." : "Continue"}
            className="register--form__continue"
            disabled={loading}
          />
        </form>
        <ModalCard
          className="forgot-pass-modal"
          show={modalVisible}
          message={modalMessage}
          onClose={closeModal}
          role="alertdialog"
          aria-labelledby="modal-title"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
