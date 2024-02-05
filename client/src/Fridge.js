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

    async function remove(e, name, removeQuantity) {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/fridge/${name}`, {
                removeQuantity
            })
            .then(res => {
                if (res.data === "quantityremoved") {
                    alert("Quantity removed")
                    getFridgeData();
                }
                else if(res.data === "itemnotremoved") {
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
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.expiryDate}</td>
                        <td>
                            <input type="number" min="1" value={removeQuantity} onChange={(e) => setRemoveQuantity(e.target.value)}></input>
                        </td>
                        <td>
                            <button type='button' onClick={(e => remove(e, item.name, removeQuantity))}>Remove</button>
                        </td>
                    </tr>
                ))}
            </table>

            <h2>Fridge Activity</h2>
        </div>
    )

}

export default Fridge