import {Outlet, Link, useNavigate, useLocation} from "react-router-dom";
import './App.css';

const Layout = () => {

    const username = localStorage.getItem('username');

    return (
        <>
            <header>
                <nav className='pageNav'>
                    <ul>
                        <li><Link to ="/">Fridge</Link></li>
                        <li><Link to ="/Order">Place Order</Link></li>
                    </ul>
                </nav>

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