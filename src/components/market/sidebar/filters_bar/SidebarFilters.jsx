import React, { useState } from 'react';
import './SidebarFilters.css';

const SidebarFilters = ({ isOpen, onClose }) => {
  // Checkboxes for standard filters
  const [filters, setFilters] = useState({
    price: false,
    quantity: false,
    jumps: false,
  });

  // Min, max values for filters
  const [values, setValues] = useState({
    priceMin: '',
    priceMax: '',
    quantityMin: '',
    quantityMax: '',
    jumpsMin: '',
    jumpsMax: '',
  });

  // Checkboxes for security levels
  const [securityLevels, setSecurityLevels] = useState({
    nullSec: true,
    lowSec: true,
    highSec: true,
  });

  // Checkboxes for station types
  const [stationTypes, setStationTypes] = useState({
    npcStations: false,
    playerStructures: false,
  });

  // Handle checkboxes for standard filters
  const handlePriceQuantityJumpsCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  // Handle checkboxes for security levels
  const handleSecurityCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSecurityLevels((prevLevels) => ({
      ...prevLevels,
      [name]: checked,
    }));
  };

  // Handle checkboxes for NPC and Player Structures
  const handleStationCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setStationTypes((prevStations) => ({
      ...prevStations,
      [name]: checked,
    }));
  };

  // Handle changes in input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className={`sidebar-filters ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>Filters</h2>

      <div className="filter-group">
        {/* Price Filter */}
        <label>
          <input
            type="checkbox"
            name="price"
            checked={filters.price}
            onChange={handlePriceQuantityJumpsCheckboxChange}
          />
          Price
        </label>
        <div className="input-group">
          <input
            type="text"
            name="priceMin"
            value={values.priceMin}
            onChange={handleInputChange}
            placeholder="Min"
          />
          <input
            type="text"
            name="priceMax"
            value={values.priceMax}
            onChange={handleInputChange}
            placeholder="Max"
          />
        </div>

        {/* Quantity Filter */}
        <label>
          <input
            type="checkbox"
            name="quantity"
            checked={filters.quantity}
            onChange={handlePriceQuantityJumpsCheckboxChange}
          />
          Quantity
        </label>
        <div className="input-group">
          <input
            type="text"
            name="quantityMin"
            value={values.quantityMin}
            onChange={handleInputChange}
            placeholder="Min"
          />
          <input
            type="text"
            name="quantityMax"
            value={values.quantityMax}
            onChange={handleInputChange}
            placeholder="Max"
          />
        </div>

        {/* Jumps Filter */}
        <label>
          <input
            type="checkbox"
            name="jumps"
            checked={filters.jumps}
            onChange={handlePriceQuantityJumpsCheckboxChange}
          />
          Jumps
        </label>
        <div className="input-group">
          <input
            type="text"
            name="jumpsMin"
            value={values.jumpsMin}
            onChange={handleInputChange}
            placeholder="Min"
          />
          <input
            type="text"
            name="jumpsMax"
            value={values.jumpsMax}
            onChange={handleInputChange}
            placeholder="Max"
          />
        </div>

        {/* Security Filters */}
        <div className="security-filters">
          <label className="null-sec">
            <input
              type="checkbox"
              name="nullSec"
              checked={securityLevels.nullSec}
              onChange={handleSecurityCheckboxChange}
            />
            Null Sec
          </label>

          <label className="low-sec">
            <input
              type="checkbox"
              name="lowSec"
              checked={securityLevels.lowSec}
              onChange={handleSecurityCheckboxChange}
            />
            Low Sec
          </label>

          <label className="high-sec">
            <input
              type="checkbox"
              name="highSec"
              checked={securityLevels.highSec}
              onChange={handleSecurityCheckboxChange}
            />
            High Sec
          </label>
        </div>

        {/* NPC Stations & Player Structures */}
        <div className="station-filters">
          <label>
            <input
              type="checkbox"
              name="npcStations"
              checked={stationTypes.npcStations}
              onChange={handleStationCheckboxChange}
            />
            NPC Stations
          </label>

          <label>
            <input
              type="checkbox"
              name="playerStructures"
              checked={stationTypes.playerStructures}
              onChange={handleStationCheckboxChange}
            />
            Player Structures
          </label>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
