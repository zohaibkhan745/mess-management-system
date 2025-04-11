import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountCreationPage from "./pages/AccountCreation";
import SignIn from "./pages/SignIn";
import Testing from "./pages/testing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountCreationPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </Router>
  );
}

export default App;