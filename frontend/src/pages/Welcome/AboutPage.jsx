import React from "react";
import { Link } from "react-router-dom";
import CardUser from "../../components/Welcome/CardUser";
import MyButton from "../../components/Button/MyButton";
import hero from "../../assets/About/hero.svg";
import battye from "../../assets/About/battye.svg";
import sorell from "../../assets/About/sorell.svg";
import matt from "../../assets/About/matt.svg";
import alex from "../../assets/About/alex.png";
import vial from "../../assets/About/vial.svg";
import game from "../../assets/About/game.svg";
import arrow from "../../assets/HomeAssets/arrow.svg";
import "./AboutPage.css";

const mockUsers = [
  {
    img: sorell,
    name: "Ian Sorell",
    position: "CEO",
    hobby:
      "Enjoys adventurous travel, seeks new cultures and offbeat destinations",
  },
  {
    img: matt,
    name: "Maya Matt",
    position: "Founder",
    hobby: "Pop music lover, seeks joy and exciting pop concerts",
  },
  {
    img: alex,
    name: "Alex Jensen",
    position: "CTO",
    hobby: "Bookworm, creative software developer with precision",
  },
  {
    img: battye,
    name: "Keira Battye",
    position: "Product Designer",
    hobby: "Creative painter capturing beauty with imaginative artwork",
  },
  {
    img: game,
    name: "Dominic Game",
    position: "3D Artist",
    hobby: "Football enthusiast, enjoys movie nights with friends",
  },
  {
    img: vial,
    name: "James Vial",
    position: "Head of Front-End",
    hobby: "Culinary artist, explores diverse flavors, skilled in cooking",
  },
];

const AboutPage = () => {
  return (
    <div className="about--page">
      <div className="about--container">
        <img src={hero} />
        <div className="about--container__text">
          <h1>Meet our team members</h1>
          <p>
            We Focus on the details of everything we do. All to help businesses
            around the world.
            <br /> Focus on what's most important to them.
          </p>
          <Link to={"/contact"}>
            <MyButton
              hasIcon={true}
              iconSrc={arrow}
              name={"Get in Touch"}
              className="about--container__button"
            />
          </Link>
        </div>
      </div>
      <div className="user--card">
        {mockUsers.map((user, index) => (
          <CardUser key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
