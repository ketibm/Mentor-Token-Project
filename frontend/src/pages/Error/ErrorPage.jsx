import React from "react";
import "./ErrorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1>Oops, there is a problem!</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
