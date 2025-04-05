import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // Add shared styles here
import AccountCreationPage from "./pages/AccountCreation";
import SignIn from "./pages/SignIn";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountCreationPage />} />
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </Router>
  );
}
