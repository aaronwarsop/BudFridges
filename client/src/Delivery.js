import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryComponent = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get('/delivery');
        setDeliveries(response.data.deliveries);
        setLoading(false);
      } catch (error) {
        setError('Error fetching deliveries');
        setLoading(false);
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="delivery-container">
      <h1>Delivery List</h1>
      {error && <div className="error-message">Error: {error}</div>}
      {deliveries.length === 0 ? (
        <div>No deliveries found</div>
      ) : (
        <ul>
          {deliveries.map((delivery) => (
            <li key={delivery._id}>
              <p>Delivery ID: {delivery._id}</p>
              <p>Driver ID: {delivery.driverId}</p>
              <p>Status: {delivery.status}</p>
              <p>Comments: {delivery.comments}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeliveryComponent;
