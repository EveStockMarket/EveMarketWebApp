import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingBars from "../loader/Loader";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="welcome-screen">
      {isLoading ? (
        <LoadingBars />
      ) : (
        <>
          <nav className="navbar">
            <div className="nav-logo">
              <img src="/assets/main_icons/evestockmarket_logo.png" alt="Logo" />
            </div>

            <div className="nav-links">
              <Link to="/industry-calculator">Industry Calculator</Link>
              <Link to="/market">Market</Link>
              <Link to="/mining-calculator">Mining Calculator</Link>
              <Link to="/hauling-calculator">Hauling Calculator</Link>
            </div>

            <div className="nav-login">
              <Link to="/login" className="login-button">Log In</Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default WelcomeScreen;
