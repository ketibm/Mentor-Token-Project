import React from "react";

const ModalCard = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thank You!</h2>
        <p>{message}</p>
        {/* <button onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default ModalCard;
