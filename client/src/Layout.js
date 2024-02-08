import {Outlet, Link, useNavigate, useLocation} from "react-router-dom";
import './App.css';

const Layout = () => {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    return (
        <>
            <header>
                
                <nav className='pageNav'>
                    <ul>
                        {role === "head chef" ? (
                            <>
                                <li><Link to ="/">Fridge</Link></li>
                                <li><Link to ="/Order">Place Order</Link></li>
                                <li><Link to ="/HealthandSafetyReport">Health and Safety Report</Link></li>
                            </>
                            
                            ) : role === "driver" ? (
                                <>
                                    <li><Link to ="/Driver">Driver</Link></li>
                                    <li><Link to ="/Delivery">Delivery</Link></li>
                                    
                                </>
                            ) : (
                                <>
                                    <li><Link to ="/">Fridge</Link></li>
                                    <li><Link to ="/Order">Place Order</Link></li>
                                    
                                </>
                            )}
                    </ul>
                    
                </nav>
                <div className="logo">FFSMART</div>
                <div className='userNav'>
                    <ul>
                        {username ? (
                            <>
                                <li>{username}</li>
                                <li><Link to ="/login">Logout</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to ="/login">Login</Link></li>
                                <li><Link to ="/register">Register</Link></li>
                            </>
                        )} 
                    </ul>
                </div>
            </header>
            
            <Outlet/>
        </>
    )
}

export default Layout