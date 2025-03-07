import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import ItemInfoBox from "./item_info_box/ItemInfoBox";
import SellersBox from "./sellers_box/SellersBox";
import BuyersBox from "./buyers_box/BuyersBox";
import Menu from "./menu_box/Menu";
import Loader from "../loader/Loader";
import "./Market.css";

function Market() {
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
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && Object.values(componentsLoaded).every((loaded) => loaded)) {
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
    <div className="market-container">
      <Menu />
      <div className="content">
        <Sidebar
          marketGroupsFile="/invMarketGroups.csv"
          typesFile="/invTypes.csv"
          onSelect={handleItemSelect}
          onLoad={() =>
            setComponentsLoaded((prev) => ({ ...prev, sidebar: true }))
          }
        />

        <div className="main-content">
          <ItemInfoBox
            itemId={selectedItemId}
            onLoad={() =>
              setComponentsLoaded((prev) => ({ ...prev, itemInfo: true }))
            }
          />

          <div className="market-data">
            <div className="sellers-box">
              <SellersBox
                itemId={selectedItemId}
                onLoad={() =>
                  setComponentsLoaded((prev) => ({ ...prev, sellers: true }))
                }
              />
            </div>
            <div className="buyers-box">
              <BuyersBox
                itemId={selectedItemId}
                onLoad={() =>
                  setComponentsLoaded((prev) => ({ ...prev, buyers: true }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Market;
