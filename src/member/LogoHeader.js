import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import './Style.css';

function LogoHeader() {
    return (
        <header>
            <Link to="/main">
                <img src={logoImage} alt="logo" style={{cursor: 'pointer'}}/>
            </Link>
        </header>
    );
};

export default LogoHeader;
