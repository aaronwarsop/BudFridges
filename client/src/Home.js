import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const Home = () => {

    const username = localStorage.getItem('username');

    return (
        <div>
            <h1>Welcome {username}</h1>
        </div>
    )

}

export default Home