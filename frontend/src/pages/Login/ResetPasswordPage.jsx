import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyButton from "../../components/Button/MyButton";
import LoginComp from "../../components/Login/LoginComp";
import check from "../../assets/LogIn/check.svg";
import "../Register/RegisterPage.css";

const ResetPasswordPage = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  useEffect(() => {
    const { password, confirmPassword } = formData;
    const isValidPassword = passwordRegex.test(password);
    const passwordsMatch = password === confirmPassword;
    setFormValid(isValidPassword && passwordsMatch);

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/reset-password/${id}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: formData.password,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Password reset failed");
      }

      setSuccessMessage("Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage("Error resetting password. Please try again.");
      console.error("Error during password reset:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register--page">
      <LoginComp />
      <div className="register--page__form">
        <h1>Reset Password</h1>
        <p className="reset-info-message">
          Please create a new password that you don't use on any other site.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="register--form__label" htmlFor="password">
            New Password
          </label>
          <input
            className="register--form__password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="********"
            required
            autoComplete="new-password"
          />

          <label className="register--form__label" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            className="register--form__password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="********"
            required
            autoComplete="new-password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="register--form__text">
            <p>
              {formData.password.length >= 8 ? (
                <img src={check} alt="check" />
              ) : (
                "x"
              )}{" "}
              At least 8 characters
            </p>
            <p>
              {passwordRegex.test(formData.password) ? (
                <img src={check} alt="check" />
              ) : (
                "x"
              )}{" "}
              Includes uppercase, lowercase, number, and special character
            </p>
          </div>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <MyButton
              type="submit"
              hasIcon={false}
              name={"Reset Password"}
              className={`register--form__reset ${formValid ? "active" : ""}`}
              disabled={!formValid}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
