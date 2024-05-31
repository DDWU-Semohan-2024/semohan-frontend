import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from '../img/toMain.png';
import searchBtn from '../img/search.png';

function Search() {
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
                       placeholder="지역, 음식 또는 식당 입력"
                />
                <img src={searchBtn} alt="searchBtn"/>
            </div>
            <div className="search-options">
                <button className="search-option today">오늘 메뉴 검색</button>
                <button className="search-option tomorrow">내일 메뉴 검색</button>
                <button className="search-option region">지역명 검색</button>
                <button className="search-option restaurant">식당명 검색</button>
            </div>
            <section className="recent-searches">
                <div className="recent-header">
                    <span>최근 검색어</span>
                    <button className="clear-all">모두 지우기</button>
                </div>
                {/*검색어 있을 경우*/}
                <ul className="recent-list">
                    <li className="recent-item">
                        <img src={searchBtn}/>
                        <span>최근 검색어{/*최근 검색어*/}</span>
                        <span className="date">00.00{/*날짜*/}</span>
                        <button className="clear-item">X</button>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default Search;
