import React, {useEffect, useState} from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './App.css';

const Register = () => {

    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    async function submit(e) {
        e.preventDefault();
        
        try {
            await axios.post("http://localhost:5000/register", {
                username, password, role, email
            })
            .then(res => {
                if (res.data === "userexists") {
                    alert("User already exists")
                }
                else if (res.data.status === "accountcreated") {
                    const returnedRole = res.data.role;
                    localStorage.setItem("role", returnedRole);
                    localStorage.setItem("username", username);
                    window.location.reload();
                    alert("Account created")
                    history("Driver", {state:{id:role}});
                    window.location.reload();
                }
            })
            .catch (error => {
                alert("Something went wrong")
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='content'>
                <div className='loginPage'>
                    <h1>Register</h1>
            
                    <form action="POST">
                        <div className='formItem1'>
                            <input type="username" onChange={(e) =>{setUsername(e.target.value)}} name="" placeholder="Username"/>
                        </div>

                        <div className='formItem2'>
                            <input type="email" onChange={(e) =>{setEmail(e.target.value)}} name="" placeholder="Email"/>
                        </div>
                        
                        <div className='formItem3'>
                            <input type="password" onChange={(e) =>{setPassword(e.target.value)}} name="" placeholder="Password"/>
                        </div>

                        <div className='formItem3'>
                            <select onChange={(e) =>{setRole(e.target.value)}} name="role">
                                <option value="" disabled selected>Select a Role</option>
                                <option value="chef">Chef</option>
                                <option value="driver">Driver</option>
                            </select>
                        </div>

                        <div className='formItem4'>
                            <input type="submit" onClick={submit}/>
                        </div>
                    </form>

                    <br></br>
                    <p>OR</p>
                    <br></br>

                    <Link to= "/login" className='links'>Login</Link>
                </div>
            </div>
            <Outlet/>
        </>
    )

}

export default Register