import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import './Style.css';

const LogoHeader = () => {
    return (
        <header>
            <Link to="/main">
                <img
                    src={logoImage}
                    alt="logo"
                    style={{ cursor: 'pointer' }} // 클릭 가능한 커서로 변경
                />
            </Link>
        </header>
    );
};

export default LogoHeader;
