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
      <Menu />

      <div className="content">
        <Sidebar
          marketGroupsFile="/invMarketGroups.csv"
          typesFile="/invTypes.csv"
          onSelect={handleItemSelect} 
        />

        <div className="main-content">
          <ItemInfoBox itemId={selectedItemId} />

          <div className="market-data">
            <div className="sellers-box">
              <SellersBox itemId={selectedItemId}/>
            </div>
            <div className="buyers-box">
              <BuyersBox itemId={selectedItemId}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
