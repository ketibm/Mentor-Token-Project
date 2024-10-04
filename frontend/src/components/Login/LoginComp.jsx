import React from "react";
import { Link } from "react-router-dom";
import iconLogo from "../../assets/LogIn/IconLogo.svg";
import LogIn from "../../assets/LogIn/LogIn.svg";
import Rocket from "../../assets/LogIn/Rocket.svg";
import Token from "../../assets/LogIn/Token.svg";
import "./LoginComp.css";

const LoginComp = () => {
  return (
    <div className="login--container">
      <div className="login--container__left">
        <img
          className="login--container__background"
          src={LogIn}
          alt="Background"
        />
        <div className="login--container__text">
          <h1>
            GROW <br />
            YOUR <br />
            <span> STARTUP!</span>
          </h1>
          <h3>MONITORING AND EVALUATING NOW IS EASY!</h3>
        </div>
        <div className="login--container__com">
          <img src={Token} alt="Token" />
          <a
            href="https://www.hugedomains.com/domain_profile.cfm?d=mentortoken.com"
            target="_blank"
            className="link"
            rel="noopener noreferrer"
          >
            mentortoken.com
          </a>
        </div>
      </div>
      <div className="login--container__right">
        <Link to="/">
          <img
            className="login--container__logo"
            src={iconLogo}
            alt="iconLogo"
          />
        </Link>
        <img className="login--container__rocket" src={Rocket} alt="Rocket" />
      </div>
    </div>
  );
};

export default LoginComp;
