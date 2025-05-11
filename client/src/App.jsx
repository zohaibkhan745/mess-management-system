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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashBoard />} /> {/* Add the Dashboard route */}
        <Route path="/DashBoard" element={<DashBoard />} /> {/* Keep this for backward compatibility */}
        <Route path="/mess-inout" element={<MessInOut />} /> {/* Add the MessInOut route */}
        <Route path="/menu" element={<Menu />} /> {/* Add the Menu route */}
        <Route path="/rules" element={<Rules />} /> {/* Add the Rules route */}
        <Route path="/faqs" element={<FAQs />} /> {/* Add the FAQs route */}
        <Route path="/feedback" element={<Feedback />} /> {/* Add the Feedback route */}
      </Routes>
    </Router>
  );
}

export default App;