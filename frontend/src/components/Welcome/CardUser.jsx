import React from "react";
import { Link } from "react-router-dom";
import gh from "../../assets/About/gh.svg";
import In from "../../assets/About/In.svg";
import fb from "../../assets/About/fb.svg";
import "./CardUser.css";

const CardUser = ({ user }) => {
  const { img, name, position, hobby, facebook, github, linkedin } = user;
  return (
    <div className="userCard">
      <img src={img} alt={name} />
      <h3>{name}</h3>
      <span>{position}</span>
      <p>{hobby}</p>
      <div className="social">
        <Link to="https://www.facebook.com" target="_blank">
          <img src={fb} />
          {facebook}
        </Link>
        <Link to="https://www.github.com" target="_blank">
          <img src={gh} />
          {github}
        </Link>
        <Link to="https://www.linkedin.com" target="_blank">
          <img src={In} />
          {linkedin}
        </Link>
      </div>
    </div>
  );
};

export default CardUser;
