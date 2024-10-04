import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import iconLogo from "../../assets/LogIn/IconLogo.svg";
import iconArrow from "../../assets/DashAssets/iconArrow.svg";
import logout from "../../assets/DashAssets/logout.svg";
import rectangle from "../../assets/DashAssets/rectangle.svg";
import dash from "../../assets/DashAssets/dash.svg";
import mentors from "../../assets/DashAssets/mentors.svg";
import stats from "../../assets/DashAssets/stats.svg";
import jobs from "../../assets/DashAssets/jobs.svg";
import "./Dashboard.css";

const Dashboard = ({ role }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSelected, setIsSelected] = useState("");

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleDash = (dash) => {
    setIsSelected(isSelected === dash ? "" : dash);
  };

  const navLinks =
    role === "startup"
      ? [
          { to: "/dash-s", icon: dash, label: "Dashboard", name: "dashboard" },
          { to: "/mentors", icon: mentors, label: "Mentors", name: "mentors" },
          { to: "/jobs", icon: jobs, label: "Jobs", name: "jobs" },
        ]
      : [
          { to: "/dash-m", icon: dash, label: "Dashboard", name: "dashboard" },
          { to: "/stats", icon: stats, label: "My Stats", name: "stats" },
          { to: "/job-feed", icon: jobs, label: "Job Feed", name: "job-feed" },
        ];

  return (
    <>
      {isVisible && (
        <div className="dashboard--container">
          <NavLink to="/" className="dashboard--container__logo">
            <img src={iconLogo} alt="iconLogo" />
            <h4>Mentor Token</h4>
          </NavLink>
          <img
            className="arrow"
            src={iconArrow}
            alt="iconArrow"
            onClick={handleToggle}
          />
          <nav>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "dashboard--container__dash-active"
                    : "dashboard--container__dash"
                }
                onClick={() => handleDash(link.name)}
              >
                <img src={link.icon} alt={link.name} className="dash--icon" />
                <p>{link.label}</p>
                {isSelected === link.name && (
                  <img className="rectangle" src={rectangle} alt="rectangle" />
                )}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/logout">
            <div className="dashboard--container__logout">
              <img src={logout} alt="logout" />
              <p>Logout</p>
            </div>
          </NavLink>
        </div>
      )}
      {!isVisible && (
        <img
          className="arrow--copy"
          src={iconArrow}
          alt="iconArrow"
          onClick={handleToggle}
        />
      )}
    </>
  );
};

Dashboard.propTypes = {
  role: PropTypes.oneOf(["startup", "mentor"]).isRequired,
};

export default Dashboard;
