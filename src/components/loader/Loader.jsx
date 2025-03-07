import React from "react";
import "./Loader.css"; 

const LoadingBars = () => {
  return (
    <div className="loading-bars-container">
      <div className="bars">
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
        <div className="bar bar4"></div>
        <div className="bar bar5"></div>
      </div>
      <img src="/assets/main_icons/evestockmarket_logo.png" alt="EVE Online Logo" className="loading-logo" />
    </div>
  );
};

export default LoadingBars;
