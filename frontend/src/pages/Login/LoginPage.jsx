import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyButton from "../../components/Button/MyButton";
import LoginComp from "../../components/Login/LoginComp";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(result),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      console.log("Login Response:", data);
      if (data && data.token && data.user) {
        const userId = data.user.id;
        const userRole = data.user.role;
        const userName = data.user.name;
        const jwt_token = data.token;

        window.localStorage.setItem("jwt_token", jwt_token);
        window.localStorage.setItem("currentUserId", userId);
        window.localStorage.setItem("currentUserName", userName);
        window.localStorage.setItem("currentUserRole", userRole);

        console.log("Login successful. User role:", userRole);

        if (userRole === "mentor") {
          navigate("/dash-m");
        } else if (userRole === "startup") {
          navigate("/dash-s");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="login--page">
      <LoginComp />
      <div className="login--page__form">
        <div>
          <h2>LOG IN TO MENTOR TOKEN</h2>
          <p>Enter your email and pass to login</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="login--form__label" htmlFor="email">
            Email
          </label>
          <input
            className="login--form__input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="mentortoken@gmail.com"
            autoComplete="email"
            required
          />
          <label className="login--form__label" htmlFor="password">
            Password
          </label>
          <input
            className="login--form__input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <MyButton
            type="submit"
            hasIcon={false}
            name={"Log in"}
            className="login--form__button"
          />
          <div className="login--form__register">
            <p>
              Don't have account?
              <Link to={"/register"}>
                <span>Register</span>
              </Link>{" "}
              <br />
              <Link to={"/forgot-password"}>
                <span>Forgot password</span>
              </Link>
            </p>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
