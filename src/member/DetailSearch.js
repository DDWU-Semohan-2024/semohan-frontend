import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';

function DetailSearch() {
    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
        </div>
    );
}

export default DetailSearch;
