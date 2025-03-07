import React from "react";
import "./Loader.css"; // Stylizacja słupków

const LoadingBars = () => {
  return (
    <div className="loading-bars-container">
      <div className="bar bar1"></div>
      <div className="bar bar2"></div>
      <div className="bar bar3"></div>
      <div className="bar bar4"></div>
      <div className="bar bar5"></div>
    </div>
  );
};

export default LoadingBars;
