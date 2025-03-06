import React, { useEffect, useState } from "react";
import UpIcon from "/assets/main_icons/triangle_icon_up_icon.png";
import DownIcon from "/assets/main_icons/triangle_down_icon.png";
import MinusIcon from "/assets/main_icons/minus_icon.png";
import "./SellersBox.css";

const SellersBox = ({ itemId }) => { 
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortStates, setSortStates] = useState({
    price: 2,
    quantity: 0,
    location: 0,
    system: 0,
    region: 0,
    expires: 0
  });

  useEffect(() => {
    if (!itemId) return; 
    setIsLoading(true);
    setSellers([]); 

    fetch(`http://16.171.222.100:8000/market_orders/${itemId}`)
      .then(response => response.json())
      .then(data => {
        const sellOrders = data.orders.filter(order => !order.is_buy_order); 
        const sortedSellOrders = [...sellOrders].sort((a, b) => b.price - a.price); 
        setSellers(sortedSellOrders);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      })
      .finally(() => setIsLoading(false));
  }, [itemId]); 

  const handleSortClick = (column) => {
    const newSortStates = {
      price: 0,
      quantity: 0,
      location: 0,
      system: 0,
      region: 0,
      expires: 0
    };
    
    // Calculate the new state for the clicked column
    let newState;
    if (sortStates[column] === 0) {
      newState = 1;
    } else {
      newState = sortStates[column] === 1 ? 2 : 1;
    }
    newSortStates[column] = newState;

    setSortStates(newSortStates);

    // Sorting logic
    const newSellers = [...sellers];

    if (newState !== 0) {
      newSellers.sort((a, b) => {
        let valueA, valueB;
        switch(column) {
          case 'price':
            valueA = a.price;
            valueB = b.price;
            break;
          case 'quantity':
            valueA = a.quantity;
            valueB = b.quantity;
            break;
          case 'location':
            valueA = a.location;
            valueB = b.location;
            break;
          case 'system':
            valueA = a.system;
            valueB = b.system;
            break;
          case 'region':
            valueA = a.region;
            valueB = b.region;
            break;
          case 'expires':
            valueA = a.remaining_time[0] * 24 + a.remaining_time[1];
            valueB = b.remaining_time[0] * 24 + b.remaining_time[1];
            break;
        }
        
        if (newState === 1) return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
      });
      setSellers(newSellers);
    }
  };

  const getSortIcon = (column) => {
    switch(sortStates[column]) {
      case 0: return <img src={MinusIcon} alt="Neutral" className="icon" />;
      case 1: return <img src={UpIcon} alt="Up" className="icon" />;
      case 2: return <img src={DownIcon} alt="Down" className="icon" />;
      default: return <img src={MinusIcon} alt="Neutral" className="icon" />;
    }
  };

  return (
    <div className="sellers-box">
      {isLoading && <div className="loading-overlay"></div>}
      <h3>Sellers</h3>
      <div className="table-container">
        {!isLoading && sellers.length > 0 ? (
        <table className="scrollable-table">
          <thead>
            <tr>
              <th onClick={() => handleSortClick('quantity')}>
                Quantity {getSortIcon('quantity')}
              </th>
              <th onClick={() => handleSortClick('price')}>
                Price {getSortIcon('price')}
              </th>
              <th onClick={() => handleSortClick('location')}>
                Location {getSortIcon('location')}
              </th>
              <th onClick={() => handleSortClick('system')}>
                System {getSortIcon('system')}
              </th>
              <th onClick={() => handleSortClick('region')}>
                Region {getSortIcon('region')}
              </th>
              <th onClick={() => handleSortClick('expires')}>
                Expires in {getSortIcon('expires')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller, index) => (
              <tr key={index}>
                <td>{seller.quantity.toLocaleString()}</td>
                <td>{seller.price.toFixed(2)} ISK</td>
                <td>{seller.location}</td>
                <td>{seller.system}</td>
                <td>{seller.region}</td>
                <td>{`${seller.remaining_time[0]} days, ${seller.remaining_time[1]} hours`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : null}
      </div>
    </div>
  );
};

export default SellersBox;