import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const HealthandSafetyReport = () => {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [reportTitle, setReportTitle] = useState('');
    const [reportInformation, setReportInformation] = useState('');

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

    async function submit(e) {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/healthandsafetyreport", {
                username, role, reportTitle, reportInformation
            })
            .then(res => {
                if (res.data.status === "healthandsafetyreportcreated") {
                    alert("Health and Safety Report created")
                }
                else if (res.data === "healthandsafetyreportnotcreated") {
                    alert("Problem creating Health and Safety Report")
                }
            })
        } catch (error) {
            
        }
    }

    return (
        <div className="report-container">
            <h1>Health and Safety Report</h1>

            <form action='POST'>
                <div className='formItem1'>
                    <input type="text" name="" placeholder="Report Title" onChange={(e) => {setReportTitle(e.target.value)}}/>
                </div>
                <div className='formItem2'>
                    <textarea name="" placeholder="Report Information" onChange={(e) => {setReportInformation(e.target.value)}}></textarea>
                </div>
                <div className='formItem3'>
                    <input type="submit" onClick={submit}/>
                </div>
            </form>
        </div>
    )

}

export default HealthandSafetyReport;