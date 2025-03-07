import React, { useEffect, useState } from "react";
import UpIcon from "/assets/main_icons/triangle_icon_up_icon.png";
import DownIcon from "/assets/main_icons/triangle_down_icon.png";
import MinusIcon from "/assets/main_icons/minus_icon.png";
import "./BuyersBox.css";

const BuyersBox = ({ itemId }) => {
  const [buyers, setBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortStates, setSortStates] = useState({
    price: 1, 
    quantity: 0,
    location: 0,
    system: 0,
    region: 0,
    minVolume: 0,
    expires: 0
  });

  useEffect(() => {
    if (!itemId) return;

    setIsLoading(true);
    setBuyers([]); 

    fetch(`https://api.evestockmarket.pl/market_orders/${itemId}`)
      .then(response => response.json())
      .then(data => {
        const buyOrders = data.orders.filter(order => order.is_buy_order);
        const sortedBuyOrders = [...buyOrders].sort((a, b) => a.price - b.price);
        setBuyers(sortedBuyOrders);
      })
      .catch(error => {
        console.error("Błąd podczas pobierania danych: ", error);
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
      minVolume: 0,
      expires: 0
    };
    
    let newState;
    if (sortStates[column] === 0) {
      newState = 1; 
    } else {
      newState = sortStates[column] === 1 ? 2 : 1; 
    }
    newSortStates[column] = newState;

    setSortStates(newSortStates);

    const newBuyers = [...buyers];

    if (newState !== 0) {
      newBuyers.sort((a, b) => {
        let valueA, valueB;
        switch(column) {
          case 'quantity':
            valueA = a.quantity;
            valueB = b.quantity;
            break;
          case 'price':
            valueA = a.price;
            valueB = b.price;
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
          case 'minVolume':
            valueA = a.min_volume;
            valueB = b.min_volume;
            break;
          case 'expires':
            valueA = a.remaining_time[0] * 24 + a.remaining_time[1];
            valueB = b.remaining_time[0] * 24 + b.remaining_time[1];
            break;
        }
        
        if (newState === 1) return valueA > valueB ? 1 : -1; 
        return valueA < valueB ? 1 : -1;
      });
      setBuyers(newBuyers);
    }
  };

  const getSortIcon = (column) => {
    switch(sortStates[column]) {
      case 0: return <img src={MinusIcon} alt="Neutralny" className="icon" />;
      case 1: return <img src={UpIcon} alt="W górę" className="icon" />;
      case 2: return <img src={DownIcon} alt="W dół" className="icon" />;
      default: return <img src={MinusIcon} alt="Neutralny" className="icon" />;
    }
  };

  return (
    <div className="buyers-box">
      {isLoading && <div className="loading-overlay"></div>}
      <h3>Buyers</h3>
      <div className="table-container">
        {!isLoading && buyers.length > 0 ? (
        <table className="scrollable-table">
          <thead>
            <tr>
              <th onClick={() => handleSortClick('quantity')}>
                Quanity {getSortIcon('quantity')}
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
              <th onClick={() => handleSortClick('minVolume')}>
                Min Quanity {getSortIcon('minVolume')}
              </th>
              <th onClick={() => handleSortClick('expires')}>
                Expires in {getSortIcon('expires')}
              </th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer, index) => (
              <tr key={index}>
                <td>{buyer.quantity.toLocaleString()}</td>
                <td>{buyer.price.toFixed(2)} ISK</td>
                <td>{buyer.location}</td>
                <td>{buyer.system}</td>
                <td>{buyer.region}</td>
                <td>{buyer.min_volume.toLocaleString()}</td>
                <td>{`${buyer.remaining_time[0]} days, ${buyer.remaining_time[1]} hours`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : null}
      </div>
    </div>
  );
};

export default BuyersBox;