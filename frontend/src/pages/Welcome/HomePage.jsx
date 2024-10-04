import React from "react";
import { Link } from "react-router-dom";
import unsplash from "../../assets/HomeAssets/unsplash.svg";
import scene from "../../assets/HomeAssets/scene.svg";
import adobe from "../../assets/HomeAssets/adobe.svg";
import braze from "../../assets/HomeAssets/braze.svg";
import atlassian from "../../assets/HomeAssets/atlassian.svg";
import ghost from "../../assets/HomeAssets/ghost.svg";
import hellosign from "../../assets/HomeAssets/hellosign.svg";
import hubSpot from "../../assets/HomeAssets/hubSpot.svg";
import openDoor from "../../assets/HomeAssets/openDoor.svg";
import treeHouse from "../../assets/HomeAssets/treeHouse.svg";
import intercom from "../../assets/HomeAssets/intercom.svg";
import maze from "../../assets/HomeAssets/maze.svg";
import feature from "../../assets/HomeAssets/feature.svg";
import first from "../../assets/HomeAssets/first.svg";
import second from "../../assets/HomeAssets/second.svg";
import third from "../../assets/HomeAssets/third.svg";
import fourth from "../../assets/HomeAssets/fourth.svg";
import Mentors from "../../assets/HomeAssets/Mentors.svg";
import mentor from "../../assets/HomeAssets/mentor.svg";
import arrow from "../../assets/HomeAssets/arrow.svg";
import MyButton from "../../components/Button/MyButton";
import FeaturesCard from "../../components/Welcome/FeaturesCard";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home--page">
      <div className="image--container">
        <img className="background" src={unsplash} alt="background" />
        <img className="comp" src={scene} alt="scene" />
      </div>
      <div className="background--text">
        <h1>Grow your StartUp! Monitoring and Evaluating now is easy!</h1>
        <p>
          Welcome to Mentor Token, where we redefine the dynamics of start-up
          <br />
          success. Our innovative platform offers a transformative approach to
          <br />
          mentorship, ensuring that mentors are not just engaged but motivated
          <br />
          to drive the success of the ventures they support.
        </p>
        <div className="home--page__buttons">
          <Link to={"/register"}>
            <MyButton
              hasIcon={true}
              iconSrc={arrow}
              name={"Get Started"}
              className="header--button__started"
            />
          </Link>
          <Link to={"/contact"}>
            <MyButton
              hasIcon={true}
              iconSrc={arrow}
              name={"Get in touch"}
              className="header--button__touch"
            />
          </Link>
        </div>
      </div>
      <div className="logos">
        <p className="logo">
          <img src={adobe} alt="adobe" />
          <img src={braze} alt="braze" />
          <img src={hellosign} alt="hellosign" />
          <img src={maze} alt="maze" />
          <img src={ghost} alt="ghost" />
        </p>
        <p className="logo">
          <img src={atlassian} alt="atlassian" />
          <img src={treeHouse} alt="treeHouse" />
          <img src={intercom} alt="intercom" />
          <img src={openDoor} alt="openDoor" />
          <img src={hubSpot} alt="hubSpot" />
        </p>
        <p>
          More than 25+ Startups around the
          <br /> world trusted Mentor Token.
        </p>
      </div>
      <div className="features">
        <img className="features--img" src={feature} alt="feature" />
        <div className="features--text">
          <h3>FEATURES</h3>
          <h2>
            Boost Your Startup's Journey:
            <br /> Discover Mentor Token's Robust
            <br /> Features
          </h2>
        </div>

        <div className="features--card">
          <FeaturesCard
            img={first}
            alt="Goal Setting"
            title={"Goal Setting"}
            description={
              "Set clear and achievable goals for your startup's success."
            }
          />
          <FeaturesCard
            img={second}
            alt="Performance Tracking"
            title={"Performance Tracking"}
            description={
              "Monitor mentor performance in real-time and track progress."
            }
          />

          <FeaturesCard
            img={third}
            alt="Reward System"
            title={"Reward System"}
            description={
              "Motivate mentors with a secure and rewarding token-based reward system."
            }
          />
          <FeaturesCard
            img={fourth}
            alt="Knowledge Library"
            title={"Knowledge Library"}
            description={
              "Access a comprehensive knowledge library to equip mentors with the skills, and motivation."
            }
          />
        </div>
      </div>
      <div className="home--page__mentors">
        <h1>
          Every <span className="home--page__span">success</span> is rewarded!
        </h1>
        <div className="home--page__image">
          <img className="home--page__imgMentors" src={Mentors} />
          <img className="home--page__imgMentor" src={mentor} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
