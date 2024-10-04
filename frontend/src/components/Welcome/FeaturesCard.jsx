import React from "react";
import "./FeaturesCard.css";

const FeaturesCard = ({ img, title, description }) => {
  return (
    <div className="featuresCard">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeaturesCard;
