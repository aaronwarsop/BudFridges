import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const HealthandSafetyReport = () => {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    useEffect(() => {
        async function getHealthandSafetyReport() {
            try {
                const healthandSafetyReportResponse = await axios.get("http://localhost:5000/healthandsafetyreport")
                console.log(healthandSafetyReportResponse.data);
            } catch (error) {
                console.error("Problem fetching health and safety report data", error)
            }
        }
        getHealthandSafetyReport();
    }, []);

    return (
        <div>
            <h1>Health and Safety Report</h1>
        </div>
    )

}

export default HealthandSafetyReport;