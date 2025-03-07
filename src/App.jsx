import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomeScreen from "./components/welcome_screen/WelcomeScreen";
import Market from "./components/market/Market";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
};

export default App;
