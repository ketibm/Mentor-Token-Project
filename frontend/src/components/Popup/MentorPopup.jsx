import React, { useState } from "react";
import MyButton from "../../components/Button/MyButton";
import close from "../../assets/DashAssets/close.svg";
import "./MentorPopup.css";

const MentorPopup = ({ onClose }) => {
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.surname) {
      setError(true);
      return;
    }
    setFormData({ email: "", name: "", surname: "" });
    setError(false);
    onClose();
  };

  return (
    <div className="mentorPopup-overlay">
      <div className="mentorPopup-container">
        <div className="mentorPopup__title">
          <h1>ADD NEW MENTOR</h1>
          <img src={close} alt="close" onClick={onClose} />
        </div>
        <p>Add new mentor and start monitoring</p>
        <form onSubmit={handleSubmit}>
          <label className="mentorPopup__label" htmlFor="email">
            Email Address
          </label>
          <input
            className="mentorPopup__input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="newmentor@gmail.com"
            autoComplete="email"
            required
          />
          <div className="user-form">
            <label className="user-form__label-name" htmlFor="text">
              Name
            </label>
            <input
              className="user-form__input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <label className="user-form__label-surname" htmlFor="text">
              Surname
            </label>
            <input
              className="user-form__input"
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              placeholder="Surname"
              required
            />
          </div>

          <MyButton
            type="submit"
            hasIcon={false}
            name={"Create new Mentor"}
            className="mentorPopup__button"
          />
          {error}
        </form>
      </div>
    </div>
  );
};

export default MentorPopup;
