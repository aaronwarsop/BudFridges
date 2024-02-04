import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const Driver = () => {

    const username = localStorage.getItem('username');

    return (
        <div>
            <h1>Driver</h1>
        </div>
    )

}

export default Driver