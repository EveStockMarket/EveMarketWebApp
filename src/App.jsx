import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import ItemInfoBox from "./components/item_info_box/ItemInfoBox";
import SellersBox from "./components/sellers_box/SellersBox";
import BuyersBox from "./components/buyers_box/BuyersBox";
import Menu from "./components/menu_box/Menu";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [componentsLoaded, setComponentsLoaded] = useState({
    sidebar: false,
    itemInfo: false,
    sellers: false,
    buyers: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketGroupsResponse = await fetch("/invMarketGroups.csv");
        const typesResponse = await fetch("/invTypes.csv");

        if (!marketGroupsResponse.ok || !typesResponse.ok) {
          throw new Error("Failed to load market data");
        }

        const marketGroupsText = await marketGroupsResponse.text();
        const typesText = await typesResponse.text();

        setMarketData({ marketGroups: marketGroupsText, types: typesText });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      Object.values(componentsLoaded).every((loaded) => loaded)
    ) {
      setLoading(false);
    }
  }, [componentsLoaded, loading]);

  const handleItemSelect = (itemId) => {
    console.log("Selected item ID:", itemId);
    setSelectedItemId(itemId);
  };

  if (loading) {
    return <Loader />; 
  }

  return (
    <div className="app-container">
      <Menu />
      <div className="content">
        <Sidebar
          marketGroupsFile="/invMarketGroups.csv"
          typesFile="/invTypes.csv"
          onSelect={handleItemSelect}
          onLoad={() => setComponentsLoaded((prev) => ({ ...prev, sidebar: true }))}
        />

        <div className="main-content">
          <ItemInfoBox
            itemId={selectedItemId}
            onLoad={() => setComponentsLoaded((prev) => ({ ...prev, itemInfo: true }))}
          />

          <div className="market-data">
            <div className="sellers-box">
              <SellersBox
                itemId={selectedItemId}
                onLoad={() => setComponentsLoaded((prev) => ({ ...prev, sellers: true }))}
              />
            </div>
            <div className="buyers-box">
              <BuyersBox
                itemId={selectedItemId}
                onLoad={() => setComponentsLoaded((prev) => ({ ...prev, buyers: true }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
