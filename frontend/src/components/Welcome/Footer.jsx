import React from "react";
import { Link } from "react-router-dom";
import tokenImg from "../../assets/HomeAssets/tokenImg.svg";
import linkedin from "../../assets/HomeAssets/linkedin.svg";
import facebook from "../../assets/HomeAssets/facebook.svg";
import twitter from "../../assets/HomeAssets/twitter.svg";
import "./Footer.css";

const Footer = () => {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch("http://localhost:8000/api/auth/login");
  //     if (res.ok) {
  //       window.localStorage.setItem("token", res.data.token);
  //     }
  //   };
  // }, []);

  return (
    <footer>
      <div className="footer--container">
        <div className="footer--token">
          <img src={tokenImg} />
          <p>
            With Mentor Token, every failure
            <br /> transforms into an opportunity for
            <br />
            growth.
          </p>
        </div>
        <div className="footer--pages">
          <h3>Pages</h3>
          <p>
            <Link to={"/"}>Home</Link>
          </p>
          <p>
            <Link to={"/contact"}>Contact US</Link>
          </p>
        </div>
        <div className="footer--contact">
          <h3>Contact</h3>
          <p>
            <a href="mailto:info@mentortoken.com">info@mentortoken.com</a>
          </p>
          <p>+ ( 389 ) 123 456 789</p>
        </div>
        <div className="footer--follow">
          <h3>Follow US</h3>
          <Link to="https://www.linkedin.com" target="_blank">
            <img src={linkedin} alt="LinkedIn" />
          </Link>
          <Link to="https://www.twitter.com" target="_blank">
            <img src={twitter} alt="Twitter" />
          </Link>
          <Link to="https://www.facebook.com" target="_blank">
            <img src={facebook} alt="Facebook" />
          </Link>
        </div>
      </div>
      <hr />
      <p>©2024 Mentor Token. All right reserved.</p>
    </footer>
  );
};

export default Footer;
