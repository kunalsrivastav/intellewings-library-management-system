import React from "react";
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="home">
            <h1>Welcome to Library Management System</h1>
            <div>
                <span className="action" onClick={() => navigate('/login')}>Login</span>
                <span>OR</span>
                <span className="action" onClick={() => navigate('/signup')}>Signup</span>
                <span>to proceed.</span>
            </div>
        </div>
    );
};

export default Home;