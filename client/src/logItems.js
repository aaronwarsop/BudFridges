import React, { useState } from 'react';
import axios from 'axios';

const LogDamagedMissingItem = () => {
  const [itemId, setItemId] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleLogItem = async () => {
    try {
      const response = await axios.post('/log-damaged-missing-item', {
        itemId,
        description,
        userId
      });
      setResponseMessage(response.data);
    } catch (error) {
      setResponseMessage('Error logging item');
      console.error('Error logging item:', error);
    }
  };

  return (
    <div className="item-container">
      <h2>Log Damaged/Missing Item</h2>
      <label>
        Item ID:
        <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        User ID:
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <button onClick={handleLogItem}>Log Item</button>
      {responseMessage && <div>{responseMessage}</div>}
    </div>
  );
};

export default LogDamagedMissingItem;
