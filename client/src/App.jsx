import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashBoard from "./pages/DashBoard/DashBoard"; // Import the Dashboard component
import MessInOut from "./pages/MessInOut/MessInOut"; // Import the MessInOut component
import Menu from "./pages/Menu/Menu"; // Import the Menu component
import Rules from "./pages/Rules/Rules"; // Import the Rules component
import FAQs from "./pages/FAQs/FAQs"; // Import the FAQs component
import Feedback from "./pages/Feedback/Feedback"; // Import the Feedback component
import Profile from "./pages/Profile/Profile"; // Import the Profile component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import { AuthProvider } from "./contexts/AuthContext"; // Import the AuthProvider

// Import Receptionist Dashboard Components
import ReceptionistDashboard from "./pages/ReceptionistDashboard/ReceptionistDashboard";
import StartAttendance from "./pages/ReceptionistDashboard/StartAttendance/StartAttendance";
import ManualInStudent from "./pages/ReceptionistDashboard/ManualInStudent/ManualInStudent";
import ViewTodaysAttendance from "./pages/ReceptionistDashboard/ViewTodaysAttendance/ViewTodaysAttendance";
import SearchStudentRecord from "./pages/ReceptionistDashboard/SearchStudentRecord/SearchStudentRecord";

function App() {
  return (
    <Router>
      <AuthProvider>        <Routes>        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Student Dashboard Routes - Protected for students */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <DashBoard />
          </ProtectedRoute>
        } />
        <Route path="/DashBoard" element={
          <ProtectedRoute requiredRole="student">
            <DashBoard />
          </ProtectedRoute>
        } /> {/* Keep this for backward compatibility */}
        <Route path="/mess-inout" element={
          <ProtectedRoute requiredRole="student">
            <MessInOut />
          </ProtectedRoute>
        } />
        <Route path="/menu" element={
          <ProtectedRoute requiredRole="student">
            <Menu />
          </ProtectedRoute>
        } />
        <Route path="/rules" element={
          <ProtectedRoute requiredRole="student">
            <Rules />
          </ProtectedRoute>
        } />
        <Route path="/faqs" element={
          <ProtectedRoute requiredRole="student">
            <FAQs />
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute requiredRole="student">
            <Feedback />
          </ProtectedRoute>
        } />

        {/* Receptionist Dashboard Routes - Protected for receptionists */}
        <Route path="/receptionist-dashboard" element={
          <ProtectedRoute requiredRole="receptionist">
            <ReceptionistDashboard />
          </ProtectedRoute>
        } />
        <Route path="/start-attendance" element={
          <ProtectedRoute requiredRole="receptionist">
            <StartAttendance />
          </ProtectedRoute>
        } />
        <Route path="/manual-in-student" element={
          <ProtectedRoute requiredRole="receptionist">
            <ManualInStudent />
          </ProtectedRoute>
        } />
        <Route path="/view-todays-attendance" element={
          <ProtectedRoute requiredRole="receptionist">
            <ViewTodaysAttendance />
          </ProtectedRoute>
        } />      <Route path="/search-student-record" element={
          <ProtectedRoute requiredRole="receptionist">
            <SearchStudentRecord />
          </ProtectedRoute>
        } />

        {/* Profile Route - Accessible to both roles */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } /></Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;