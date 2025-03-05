import React from "react";
import "./ItemMarketData.css";

const ItemMarketData = ({ analysis }) => {
  if (!analysis) {
    return <div className="item-market-data">Loading...</div>;
  }

  return (
    <div className="item-market-data">
      <div className="avg-sell-buy-margin">
        <div className="avg-sell-buy">
          <h4>Avg Sell Price: {analysis.avg_sell_price.toFixed(2)} ISK</h4>
          <h4>Avg Buy Price: {analysis.avg_buy_price.toFixed(2)} ISK</h4>
        </div>
        <div className="avg-margin">
          <h5>Avg Margin: {analysis.avg_margin.toFixed(2)} ISK</h5>
        </div>
      </div>
      <div className="vol-sell-buy">
        <h4>Quantity Sell: {analysis.avg_quantity.toLocaleString()}</h4>
        <h4>Quantity Buy: {analysis.avg_volume.toLocaleString()}</h4>
      </div>
      <div className="med-sell-buy">
        <h4>Median Sell: {analysis.median_sell_price.toFixed(2)} ISK</h4>
        <h4>Median Buy: {analysis.median_buy_price.toFixed(2)} ISK</h4>
      </div>
    </div>
  );
};

export default ItemMarketData;
