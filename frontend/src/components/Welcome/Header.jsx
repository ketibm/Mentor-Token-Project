import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import tokenImg from "../../assets/HomeAssets/tokenImg.svg";
import arrow from "../../assets/HomeAssets/arrow.svg";
import MyButton from "../../components/Button/MyButton";
import "./Header.css";

const Header = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const name = window.localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);
  return (
    <header>
      <img className="header--logo" src={tokenImg} />
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Contact
        </NavLink>
      </nav>
      <div className="header--nav__buttons">
        {userName ? (
          <span className="header--welcome">Welcome, {userName}</span>
        ) : (
          <>
            <Link to={"/login"}>
              <MyButton
                hasIcon={true}
                iconSrc={arrow}
                name={"Login"}
                className="header--button__login"
              />
            </Link>
            <Link to={"/register"}>
              <MyButton
                hasIcon={true}
                iconSrc={arrow}
                name={"Get Started"}
                className="header--button__started"
              />
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
