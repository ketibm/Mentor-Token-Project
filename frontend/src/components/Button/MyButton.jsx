import React from "react";
import "./MyButton.css";

const MyButton = ({
  type,
  onClick,
  name,
  hasIcon = false,
  iconSrc,
  className,
  disabled,
}) => {
  return (
    <button
      className={`button ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {hasIcon && (
        <img
          // style={{ height: "24px", width: "24px" }}
          src={iconSrc}
          alt="arrow"
        />
      )}
      {name}
    </button>
  );
};

export default MyButton;
