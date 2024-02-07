import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const Fridge = () => {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [fridgeData, setFridgeData] = useState([]);
    const [removeQuantities, setRemoveQuantities] = useState({});

    async function getFridgeData() {
        try {
            const fridgeResponse = await axios.get("http://localhost:5000/fridge")
            const fridgeData = fridgeResponse.data;
            setFridgeData(fridgeData);

            const initialQuantities = {};
            fridgeData.forEach(item => {
                initialQuantities[item.itemId] = 1;
            });
            setRemoveQuantities(initialQuantities);

            // automatic ordering
            fridgeData.forEach(async item => {
                if (item.quantity < 5) {
                    const updateData = {
                        quantity: item.quantity + 50,
                        expiryDate: item.expiryDate
                    }

                    try {
                        await axios.patch(`http://localhost:5000/fridge/${item.itemId}`, updateData)
                        console.log(`Item ${item.name} quantity updated.`)
                    } catch (error) {
                        console.error("Problem updating item quantity", error);
                    }
                }
            })
        } catch (error) {
            console.error("Problem fetching fridge data", error);
        }
    }
    
    useEffect(() => {
        getFridgeData();

        const interval = setInterval(() => {
            getFridgeData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    async function remove(e, itemId) {
        e.preventDefault();
        try {

            const item = fridgeData.find(item => item.itemId === itemId);

            if (item.quantity > removeQuantities[itemId]) {
                await axios.patch("http://localhost:5000/fridge", {
                removeQuantities: removeQuantities[itemId], itemId: itemId
                })
            .then(res => {
                if (res.data.status === "quantityremoved") {
                    alert("Quantity removed")
                    getFridgeData();
                }
                else if (res.data === "removequantityexceeds") {
                    alert("Remove quantity exceeds item quantity in fridge")
                }
                else if (res.data === "quantitynotremoved") {
                    alert("Quantity not removed")
                }
            })
            }
            else if (item.quantity - removeQuantities[itemId] === 0) {
                await axios.delete(`http://localhost:5000/fridge/${itemId}`)
            .then(res => {
                if (res.data.status === "itemdeleted") {
                    alert("Item deleted")
                    getFridgeData();
                }
            })  
            }  
        } catch (error) {
            alert("Error removing item quantity from fridge")
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Fridge</h1>
            
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                </tr>
                {fridgeData.map((item) => (
                    <tr key={item.itemId}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.expiryDate}</td>
                        <td>
                            <input 
                            type="number" 
                            min="1" 
                            value={removeQuantities[item.itemId]} 
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setRemoveQuantities(prevState => ({
                                    ...prevState,
                                    [item.itemId]: value
                                }));
                            }}    
                            />
                        </td>
                        <td>
                            <button type='submit' onClick={(e) => remove(e, item.itemId, removeQuantities[item.itemId])}>Remove</button>
                        </td>
                    </tr>
                ))}
            </table>

            <h2>Fridge Activity</h2>
        </div>
    )

}

export default Fridge