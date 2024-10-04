import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./routes/Root.jsx";
import RootDash from "./routes/RootDash.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/Welcome/HomePage.jsx";
import AboutPage from "./pages/Welcome/AboutPage.jsx";
import ContactPage from "./pages/Welcome/ContactPage.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage.jsx";
import LogoutPage from "./pages/Login/LogoutPage.jsx";
import RegisterPage from "./pages/Register/RegisterPage.jsx";
import RegisterStartup from "./pages/Register/RegisterStartup.jsx";
import RegisterMentor from "./pages/Register/RegisterMentor.jsx";
import StartupDashPage from "./pages/StartupView/StartupDashPage.jsx";
import MentorDashPage from "./pages/MentorView/MentorDashPage.jsx";
import MentorsPage from "./pages/StartupView/MentorsPage.jsx";
import MentorPage from "./pages/StartupView/MentorPage.jsx";
import JobsPage from "./pages/StartupView/JobsPage.jsx";
import JobFeedPage from "./pages/MentorView/JobFeedPage.jsx";
import MyStatsPage from "./pages/MentorView/MyStatsPage.jsx";
import ErrorPage from "./pages/Error/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/startup" element={<RegisterStartup />} />
        <Route path="/register/mentor" element={<RegisterMentor />} />

        <Route element={<Root />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["startup"]}>
              <RootDash userRole="startup" />
            </ProtectedRoute>
          }
        >
          <Route path="/dash-s" element={<StartupDashPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/mentor/:mentorId" element={<MentorPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <RootDash userRole="mentor" />
            </ProtectedRoute>
          }
        >
          <Route path="/dash-m" element={<MentorDashPage />} />
          <Route path="/job-feed" element={<JobFeedPage />} />
          <Route path="/stats" element={<MyStatsPage />} />
        </Route>

        {/* <Route path="/error" element={<ErrorPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
