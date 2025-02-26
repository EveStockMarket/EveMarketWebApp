import './sidebarfilters.css';

const SidebarSettings = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar-settings ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>Settings</h2>
      {/* Add your settings content here */}
    </div>
  );
};

export default SidebarSettings;