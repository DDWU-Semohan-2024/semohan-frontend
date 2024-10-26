import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';
import logoImage from '../img/semohan-logo.png';

function HeaderBFLogin() {
    return (
        <header>
            <Link to="/login">
                <img src={logoImage} alt="logo" style={{ cursor: 'pointer' }} />
            </Link>
        </header>
    );
}

export default HeaderBFLogin;
