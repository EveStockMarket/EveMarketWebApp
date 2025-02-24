import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import ItemInfoBox from "./components/item_info_box/ItemInfoBox";
import SellersBox from "./components/sellers_box/SellersBox";
import BuyersBox from "./components/buyers_box/BuyersBox";
import Menu from "./components/menu_box/Menu";
import "./App.css";

function App() {
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Handle item selection from the sidebar
  const handleItemSelect = (itemId) => {
    console.log("Selected item ID:", itemId);
    setSelectedItemId(itemId);
  };

  return (
    <div className="app-container">
      {/* Top menu bar */}
      <Menu />

      {/* Main content */}
      <div className="content">
        <Sidebar
          marketGroupsFile="/invMarketGroups.csv"
          typesFile="/invTypes.csv"
          onSelect={handleItemSelect} 
        />

        <div className="main-content">
          {/* Display selected item data */}
          <ItemInfoBox itemId={selectedItemId} />

          <div className="market-data">
            <SellersBox />
            <BuyersBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
