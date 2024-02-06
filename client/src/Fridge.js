import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const Fridge = () => {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [fridgeData, setFridgeData] = useState([]);
    const [removeQuantity, setRemoveQuantity] = useState(1);

    async function getFridgeData() {
        try {
            const fridgeResponse = await axios.get("http://localhost:5000/fridge")
            setFridgeData(fridgeResponse.data);
        } catch (error) {
            console.error("Problem fetching fridge data", error);
        }
    }
    
    useEffect(() => {
        getFridgeData();
    }, []);

    async function remove(e, itemId, removeQuantity) {
        e.preventDefault();
        try {
            await axios.patch("http://localhost:5000/fridge", {
                removeQuantity, itemId
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
        } catch (error) {
            alert("Error removing item quantity from fridge")
            console.log(error);
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
                            <input type="number" min="1" value={removeQuantity} onChange={(e) => setRemoveQuantity(e.target.value)}></input>
                        </td>
                        <td>
                            <button type='submit' onClick={(e) => remove(e, item.itemId, removeQuantity)}>Remove</button>
                        </td>
                    </tr>
                ))}
            </table>

            <h2>Fridge Activity</h2>
        </div>
    )

}

export default Fridge