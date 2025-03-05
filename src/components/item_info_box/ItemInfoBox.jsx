import { useState, useEffect } from 'react';
import './ItemInfoBox.css';
import ItemMarketData from './ItemMarketData';

const ItemInfoBox = ({ itemId }) => {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!itemId) return;

    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://esi.evetech.net/latest/universe/types/${itemId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }

        const data = await response.json();
        setItemDetails(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setItemDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;

    fetch(`https://16.171.222.100:8000/market_orders/${itemId}`)
      .then(response => response.json())
      .then(data => {
        setAnalysis(data.analysis);
      })
      .catch(error => {
        console.error("Error fetching analysis data: ", error);
      });
  }, [itemId]);

  const parseDescription = (description) => {
    if (!description) return '';
    return description.replace(/<a href=showinfo:(\d+)>(.*?)<\/a>/g, (match, id, text) => {
      return `<a href="https://everef.net/type/${id}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
  };

  return (
    <div className="item-info-box">
      <div className="item-details">
        {loading && <p>Loading item details...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && itemDetails && (
          <>
            <h3>{itemDetails.name}</h3>
            <div className="item-icon-and-description">
              <div className="icon-info-container">
                <div className="item-icon-container">
                  <img
                    src={`https://16.171.222.100:8000/icon_64/${itemId}`}
                    alt={itemDetails.name}
                    className="item-icon"
                  />
                </div>
                <img
                  src="/assets/main_icons/info_icon.png"
                  alt="Info icon"
                  className="info-icon"
                  onClick={() => setShowDescription(!showDescription)}
                />
              </div>
  
              {showDescription && (
                <div className="description-container">
                  <div className="item-description-popup">
                    <div
                      className="item-description"
                      dangerouslySetInnerHTML={{ __html: parseDescription(itemDetails.description) }}
                    />
                    <button onClick={() => setShowDescription(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {!loading && !error && !itemDetails && <p>Select an item to view details.</p>}
      </div>
      <ItemMarketData itemId={itemId} analysis={analysis} />
    </div>
  );
  
};

export default ItemInfoBox;
