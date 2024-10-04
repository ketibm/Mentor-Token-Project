import React, { useState, useEffect } from "react";
import MyButton from "../../components/Button/MyButton";
import ModalCard from "../../components/Modal/ModalCard";
import background from "../../assets/Contact/background.svg";
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.message) {
      setModalMessage("All fields are required.");
      setShowModal(true);
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setModalMessage("Please enter a valid email address.");
      setShowModal(true);
      console.log("Validation failed: Invalid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      console.log("Sending fetch request...");
      const response = await fetch(
        "http://localhost:8000/api/email/receive-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Response data:", data);
    } catch (error) {
      console.error("Error sending message:", error);
      setModalMessage(
        "There was an error sending your message. Please try again later."
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <div className="contact--page">
      <img src={background} alt="background" />
      <div className="contact--text">
        <div className="contact--text__title">
          <h1>Let’s Talk!</h1>
          <p>
            We’re thrilled to connect with you! Whether you have a question,
            need assistance, or want to discuss a potential project, we’re
            <br />
            here to listen and help. At Mentor Token, we believe in the power of
            collaboration and are committed to providing you with the best
            <br />
            support and solutions. Fill out the form below, and one of our team
            members will get back to you as soon as possible. <br />
            <span>Let’s create something amazing together!</span>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="contact--form">
            <div className="contact--form__input">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                autoComplete="name"
                required
              />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                autoComplete="email"
                required
              />
              <textarea
                className="contact--form__textarea"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your message"
                autoComplete="off"
                required
              ></textarea>
            </div>
            <div className="contact--button__container">
              <MyButton
                type="submit"
                hasIcon={false}
                name={"SEND MESSAGE"}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <ModalCard onClose={closeModal}>
          <p>{modalMessage}</p>
          <button onClick={closeModal}>Close</button>
        </ModalCard>
      )}
    </div>
  );
};

export default ContactPage;
