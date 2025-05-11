import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashBoard from "./pages/DashBoard/DashBoard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard/ReceptionistDashboard";
import ManageMeals from "./pages/ManageMeals/ManageMeals";
import ManageRules from "./pages/ManageRules/ManageRules";
import ManageFAQs from "./pages/ManageFAQs/ManageFAQs";
import ViewAttendance from "./pages/ViewAttendance/ViewAttendance";
import ManageStudents from "./pages/ManageStudents/ManageStudents";
import MessInOut from "./pages/MessInOut/MessInOut";
import Menu from "./pages/Menu/Menu";
import Rules from "./pages/Rules/Rules";
import FAQs from "./pages/FAQs/FAQs";
import Feedback from "./pages/Feedback/Feedback";
import CompleteProfile from "./pages/CompleteProfile/CompleteProfile";
import MessBill from "./pages/MessBill/MessBill";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/DashBoard" element={<DashBoard />} />

        {/* Receptionist routes */}
        <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
        <Route path="/manage-meals" element={<ManageMeals />} />
        <Route path="/manage-rules" element={<ManageRules />} />
        <Route path="/manage-faqs" element={<ManageFAQs />} />
        <Route path="/view-attendance" element={<ViewAttendance />} />
        <Route path="/manage-students" element={<ManageStudents />} />

        <Route path="/mess-inout" element={<MessInOut />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/mess-bill" element={<MessBill />} />
      </Routes>
    </Router>
  );
}

export default App;
