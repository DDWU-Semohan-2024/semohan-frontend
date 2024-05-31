import React from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from '../img/toMain.png';
import searchBtn from '../img/search.png';
import searchImage from "../img/search.png";

function Search() {
    const navigate = useNavigate();
    return (
        <div id="newBody">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
            <div id="searchBar">
                <img src={toMain} alt="toMain" onClick={() => navigate('/mainNoLogin')}/>
                <input type="text"
                       name="search"
                       className="search"
                       placeholder="지역, 음식 또는 식당 입력"
                />
                <img className="headerImg" src={searchImage} onClick={() => navigate('/resultSearch')} alt="search"/>
            </div>
            <div className="search-options">
                <div>
                    <button className="search-option lemon">오늘 메뉴 검색</button>
                    <button className="search-option gray">내일 메뉴 검색</button>
                </div>
                <div>
                    <button className="search-option gray">지역명 검색</button>
                    <button className="search-option gray">식당명 검색</button>
                </div>
            </div>
            <section className="recent-searches">
                <div className="recent-header">
                    <span>최근 검색어</span>
                    <button className="clear-all">모두 지우기</button> {/*누르면 전체 검색어 지워짐*/}
                </div>
                {/*검색어 있을 경우*/}
                <ul className="recent-list">
                    <li className="recent-item">{/*검색한 개수만큼*/}
                        <div>
                            <img src={searchBtn}/>
                            <span>최근 검색어{/*최근 검색어*/}</span>
                        </div>
                        <div>
                            <span className="date">00.00{/*날짜*/}</span>
                            <button className="clear-item">X</button> {/*누르면 해당 검색어 지워짐*/}
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default Search;
