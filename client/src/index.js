import React from 'react';
import { createRoot } from 'react-dom';
//import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Fridge from './Fridge';
import Login from './Login';
import Register from './Register';
import Order from './Order';
import Driver from './Driver';
import Delivery from './Delivery';
import HealthandSafetyReport from './HealthandSafetyReport';
import LogDamagedMissingItem from './LogAndReport';
import DeliveryReport from './LogAndReport';


export default function App() {

  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        {role === "head chef" ? (
          <Route path="/" element={<Layout/>}>
            <Route index element={<Fridge/>}/>
            <Route path="Fridge" element={<Fridge/>}/>
            <Route path="Order" element={<Order/>}/>
            <Route path="HealthandSafetyReport" element={<HealthandSafetyReport/>}/>
          </Route>
        ) : role === "driver" ? (
          <Route path="/" element={<Layout/>}>
            <Route index element={<Driver/>}/>
            <Route path="Driver" element={<Driver/>}/>
            <Route path="Delivery" element={<Delivery/>}/>
            
          </Route>
        ) : (
          <Route path="/" element={<Layout/>}>
            <Route index element={<Fridge/>}/>
            <Route path="Fridge" element={<Fridge/>}/>
            <Route path="Order" element={<Order/>}/>
          </Route>
        )}
        <Route path="Register" element={<Register/>}/>
        <Route path="Login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    
  </React.StrictMode>
);
