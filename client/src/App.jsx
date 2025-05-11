import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashBoard from "./pages/DashBoard/DashBoard";
import MessInOut from "./pages/MessInOut/MessInOut";
import Menu from "./pages/Menu/Menu";
import Rules from "./pages/Rules/Rules";
import FAQs from "./pages/FAQs/FAQs";
import Feedback from "./pages/Feedback/Feedback";
import CompleteProfile from "./pages/CompleteProfile/CompleteProfile"; // Import the CompleteProfile component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} /> {/* Add the CompleteProfile route */}
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/DashBoard" element={<DashBoard />} />
        <Route path="/mess-inout" element={<MessInOut />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;