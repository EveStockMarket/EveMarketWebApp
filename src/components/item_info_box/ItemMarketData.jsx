import "./ItemMarketData.css";

const ItemMarketData = ({ itemId }) => {
  return (
    <div className="item-market-data">
        <div className="avg-sell-buy-margin">
            <div className="avg-sell-buy">
                <h4>Avg Sell Price</h4>
                <h4>Avg Buy Price</h4>
            </div>
            <div className="avg-margin">
                <h5>Avg Margin</h5>
            </div>
        </div>
        <div className="vol-sell-buy">
            <h4>Volume Sell</h4>
            <h4>Volume Buy</h4>
        </div>
        <div className="med-sell-buy">
            <h4>Median Sell</h4>
            <h4>Median Buy</h4>
        </div>
    </div>
  );
};

export default ItemMarketData;
