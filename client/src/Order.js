import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const Order = () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [orderData, setOrderData] = useState([]);
    const [orderItemName, setOrderItemName] = useState('');
    const [orderQuantity, setOrderQuantity] = useState('');

    async function getOrderData() {
        try {
            const orderResponse = await axios.get("http://localhost:5000/order")
            setOrderData(orderResponse.data);
        } catch (error) {
            console.error("Problem fetching order data", error)
        }
    }

    async function submit(e) {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/order", {
                username, role, orderItemName, orderQuantity: parseInt(orderQuantity)
            })
            .then(res => {
                if (res.data.status === "orderplaced") {
                    alert("Order placed")
                    
                }
                else if (res.data === "ordernotplaced") {
                    alert("Order not placed")
                }
            })
        } catch (error) {
            
        }
    }

    useEffect(() => {
        getOrderData();
    }, []);

    return (
        <div className="box-container">
            <h2>Place Order</h2>

            <form action="POST">
                <div className='formItem1'>
                    <input type="text" onChange={(e) =>{setOrderItemName(e.target.value)}} name="" placeholder="Item Name"/>
                </div>
                <div className='formItem2'>
                    <input type="number" onChange={(e) =>{setOrderQuantity(e.target.value)}} name="" placeholder="Quantity"/>
                </div>
                <div className='formItem3'>
                    <input type="submit" onClick={submit}/>
                </div>
            </form>

            <h2>Order history</h2>

            <table>
                <tr>
                    <th>Order ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Created</th>
                </tr>
                {orderData.map((item) => (
                    <tr key={item.orderId}>
                        <td>{item.orderId}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.expiryDate}</td>
                        <td>{item.username}</td>
                        <td>{item.role}</td>
                        <td>{new Date(item.createdAt).toLocaleString('default', {year: 'numeric', month:'long', day:'numeric'})}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default Order;