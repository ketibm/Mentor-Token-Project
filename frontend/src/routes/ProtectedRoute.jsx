// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const userToken = localStorage.getItem("userToken");

//   if (!userToken) {
//     // If no token is found, redirect to the login page
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("currentUserRole");

  console.log("Current User Role:", userRole);
  console.log("Allowed Roles:", allowedRoles);

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // return <Navigate to={userRole === "mentor" ? "/dash-m" : "/dash-s"} />;
    return <Navigate to="/error" />;
  }

  return children;
};

export default ProtectedRoute;
