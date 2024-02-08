import React, { useEffect, useState } from 'react';
import axios from "axios";
import './App.css';

const Driver = () => {
  const [passcode, setPasscode] = useState(null);

  useEffect(() => {
    const getPasscode = async () => {
      const username = localStorage.getItem('username');
      
      try {
        const response = await axios.post('http://localhost:5000/requesting-access', {
          userId: username
        });
        
        if (response.status === 200) {
          setPasscode(response.data.passcode);
          
        } else {
          throw new Error('Failed to get passcode');
        }
      } catch (error) {
        console.error(error);
      }
    }
    
    getPasscode();
  }, []);

  const handleVerify = async () => {
    const username = localStorage.getItem('http://localhost:5000/username');
    
    try {
      const response = await axios.post('http://localhost:5000/verify-passcode', {
        driverId: username,
        passcode  
      });
      
      if (response.status === 200) {
        alert('Access granted!');
      } else {
        throw new Error('Invalid passcode');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid passcode');
    }
  }

  return (
    <div className="driver-container">
      <h1>Driver Access</h1>
      
      {passcode && 
        <div>
          <p>Your passcode is: {passcode}</p>
          
          <button onClick={handleVerify}>
            Verify Passcode
          </button>
        </div>
      }
    </div>
  )
}

export default Driver;
