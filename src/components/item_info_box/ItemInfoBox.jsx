import { useState, useEffect } from 'react';

const ItemInfoBox = ({ itemId }) => {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Function for parsing the description
  const parseDescription = (description) => {
    if (!description) return '';
    return description.replace(/<a href=showinfo:(\d+)>(.*?)<\/a>/g, (match, id, text) => {
      return `<a href="https://everef.net/type/${id}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
  };

  return (
    <div className="item-info-box">
      <h2>Item Info</h2>
      {loading && <p>Loading item details...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && itemDetails && (
        <>
          <h3>{itemDetails.name}</h3>
          <div
            className="item-description"
            dangerouslySetInnerHTML={{ __html: parseDescription(itemDetails.description) }}
          />
        </>
      )}
      {!loading && !error && !itemDetails && <p>Select an item to view details.</p>}
    </div>
  );
};

export default ItemInfoBox;
