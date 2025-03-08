import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingBars from "../loader/Loader";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimate(true);
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

          <div className="welcome-content">
            <img 
              src="/assets/main_icons/evestockmarket_logo_eve.png" 
              alt="EVE" 
              className={`eve-logo ${animate ? "animate-eve" : ""}`} 
            />
            <img 
              src="/assets/main_icons/evestockmarket_logo_evestock.png" 
              alt="Stock Market" 
              className={`stockmarket-logo ${animate ? "animate-stockmarket" : ""}`} 
            />
            <button className="begin-button"></button>
          </div>
        </>
      )}
    </div>
  );
};

export default WelcomeScreen;
