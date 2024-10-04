import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalCard from "../../components/Modal/ModalCard";

const LogoutPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      const userId = localStorage.getItem("currentUserId");

      if (userId) {
        localStorage.removeItem("jwt_token");
      }
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserRole");

      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 1000);
    };
    handleLogout();
  }, [navigate]);

  return (
    <div>
      <ModalCard
        show={showModal}
        message="You were successfully logged out."
        onClose={() => {
          setShowModal(false);
          navigate("/");
        }}
      />
      <h3>Logging out...</h3>
    </div>
  );
};

export default LogoutPage;
