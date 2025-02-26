import './SidebarFilters.css';

const SidebarFilters = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar-filters ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>Filters</h2>
    </div>
  );
};

export default SidebarFilters;