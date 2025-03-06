import React, { useState, useEffect } from "react";
import "./ItemMarketData.css";

const ItemMarketData = ({ itemId, analysis }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    if (!itemId) return; // Nie rób nic, jeśli itemId nie jest wybrany

    setIsLoading(true); // 🔥 Włącz efekt ładowania
    setMarketData(null); // 🔥 Usuń stare dane natychmiast

  }, [itemId]);

  useEffect(() => {
    if (analysis) {
      setMarketData(analysis);
      setIsLoading(false); // 🔥 Wyłącz efekt ładowania dopiero po otrzymaniu `analysis`
    }
  }, [analysis]);

  return (
    <div className="item-market-data" style={{ position: "relative", overflow: "hidden" }}>
      {/* 🔥 Gradientowe ładowanie pojawia się od razu po zmianie `itemId` i trwa do momentu otrzymania `analysis` */}
      {isLoading && <div className="loading-overlay"></div>}

      {!isLoading && marketData && (
        <>
          <div className="avg-sell-buy-margin">
            <div className="avg-sell-buy">
              <h4>Avg Sell Price: {marketData.avg_sell_price.toFixed(2)} ISK</h4>
              <h4>Avg Buy Price: {marketData.avg_buy_price.toFixed(2)} ISK</h4>
            </div>
            <div className="avg-margin">
              <h5>Avg Margin: {marketData.avg_margin.toFixed(2)} ISK</h5>
            </div>
          </div>
          <div className="vol-sell-buy">
            <h4>Quantity Sell: {marketData.avg_quantity.toLocaleString()}</h4>
            <h4>Quantity Buy: {marketData.avg_volume.toLocaleString()}</h4>
          </div>
          <div className="med-sell-buy">
            <h4>Median Sell: {marketData.median_sell_price.toFixed(2)} ISK</h4>
            <h4>Median Buy: {marketData.median_buy_price.toFixed(2)} ISK</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemMarketData;
