import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="nav-logo">
        <Link to="/">
          <img src="/assets/main_icons/evestockmarket_logo.png" alt="Logo" />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
