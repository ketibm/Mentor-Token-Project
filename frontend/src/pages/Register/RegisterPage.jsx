import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import check from "../../assets/LogIn/check.svg";
import MyButton from "../../components/Button/MyButton";
import LoginComp from "../../components/Login/LoginComp";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [isStartup, setIsStartup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  useEffect(() => {
    const trimmedName = formData.name.trim().toLowerCase();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const lowercasePassword = formData.password.toLowerCase();

    if (
      lowercasePassword.includes(trimmedName) ||
      lowercasePassword.includes(trimmedEmail)
    ) {
      setNameValid(false);
    } else {
      setNameValid(true);
    }
  }, [formData.name, formData.email, formData.password]);

  useEffect(() => {
    setEmailValid(
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
    );
  }, [formData.email]);

  useEffect(() => {
    setPasswordValid(passwordRegex.test(formData.password));
    setPasswordStrength(getPasswordStrength());
  }, [formData.password]);

  useEffect(() => {
    const passwordsMatch =
      formData.password !== "" &&
      formData.password === formData.confirmPassword;
    if (!passwordsMatch && formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
    setFormValid(
      nameValid &&
        emailValid &&
        passwordValid &&
        passwordsMatch &&
        !formData.password.includes(formData.name) &&
        !formData.password.includes(formData.email)
    );
  }, [
    nameValid,
    emailValid,
    passwordValid,
    formData.password,
    formData.confirmPassword,
    formData.name,
    formData.email,
    formData.role,
  ]);

  const handleToggle = (role) => {
    setIsStartup(role === "startup");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) {
      if (isStartup) {
        navigate("/register/startup");
      } else {
        navigate("/register/mentor");
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } else {
      console.log("Form is not valid");
    }
  };

  const getPasswordStrength = () => {
    if (formData.password.length >= 8 && /[!@#$%^&*]/.test(formData.password)) {
      return "Strong";
    }
    return "Weak";
  };

  return (
    <div className="register--page">
      <LoginComp />
      <div className="register--page__form">
        <h1>CHOOSE ACCOUNT TYPE</h1>
        <div className="register--form__button">
          <MyButton
            type="button"
            hasIcon={false}
            name="Startup"
            className={`register--button__startup ${isStartup ? "active" : ""}`}
            onClick={() => handleToggle("startup")}
          />

          <MyButton
            type="button"
            hasIcon={false}
            name="Mentor"
            className={`register--button__mentor ${!isStartup ? "active" : ""}`}
            onClick={() => handleToggle("mentor")}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label className="register--form__label" htmlFor="name">
            Name
          </label>
          <input
            className="register--form__name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name and surname"
            required
          />

          <label className="register--form__label" htmlFor="email">
            Email
          </label>

          <input
            className="register--form__email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="mentortoken@gmail.com"
            required
            autoComplete="username"
          />

          <label className="register--form__label" htmlFor="password">
            Password
          </label>

          <input
            className="register--form__password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
            autoComplete="new-password"
          />

          <label className="register--form__label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="register--form__password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}

          <div className="register--form__text">
            <p>
              {passwordValid ? <img src={check} alt="check" /> : "x"} Password
              Strength : {passwordStrength}
            </p>
            <p>
              {formData.password
                .toLowerCase()
                .includes(formData.name.trim().toLowerCase()) ||
              formData.password
                .toLowerCase()
                .includes(formData.email.trim().toLowerCase()) ? (
                "x"
              ) : (
                <img src={check} alt="check" />
              )}
              Cannot contain your name or email address
            </p>
            <p>
              {formData.password.length >= 8 ? (
                <img src={check} alt="check" />
              ) : (
                "x"
              )}{" "}
              At least 8 characters
            </p>
            <p>
              {/[!@#$%^&*]/.test(formData.password) ? (
                <img src={check} alt="check" />
              ) : (
                "x"
              )}{" "}
              Contains a number or symbol
            </p>
          </div>

          <MyButton
            type="submit"
            hasIcon={false}
            name="Continue"
            className={`register--form__continue ${formValid ? "active" : ""}`}
            disabled={!formValid}
          />

          <div className="register--form__login">
            <p>
              Already have an account?
              <Link to="/login">
                <span>Login.</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
