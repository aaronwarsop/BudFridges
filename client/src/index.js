import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Fridge from './Fridge';
import Login from './Login';
import Register from './Register';
import Order from './Order';
import Driver from './Driver';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Fridge/>}/>
          <Route path="Fridge" element={<Fridge/>}/>
          <Route path="Order" element={<Order/>}/>
        </Route>
        <Route path="Register" element={<Register/>}/>
        <Route path="Login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    
  </React.StrictMode>
);
