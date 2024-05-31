import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from "../img/toMain.png";
import searchBtn from "../img/search.png";

function ResultSearch() {
    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
            <div id="searchBar">
                <img src={toMain} alt="toMain"/>
                <input type="text"
                       name="search"
                       className="search"
                       // value={/*검색어*/}
                />
                <img src={searchBtn} alt="searchBtn"/>
            </div>
            <div>

            </div>
        </div>
    );
}

export default ResultSearch;
