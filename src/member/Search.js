import React, { useState } from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from '../img/toMain.png';
import searchBtn from '../img/search.png';
import one from '../img/1.png';
import two from '../img/2.png';
import three from '../img/3.png';
import searchImage from "../img/search.png";
import { Carousel } from 'react-bootstrap';
import axios from "axios";

function Search() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    //const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const handleSearchClick = () => {
        console.log('Searching for:', searchTerm);  // 콘솔 로그 추가
        axios.get('/restaurant/search', {
            params: {
                location: searchTerm,
                menu: searchTerm,
                name: searchTerm
            }
        })
            .then(response => {
                console.log('Response Data :', response.data);  // 응답 데이터 로그 추가
                console.log('Response  :', response);  // 응답 데이터 로그 추가
                if (response.data && response.data.length > 0) {
                    navigate('/resultSearch', { state: { results: response.data } });
                } else {
                    console.log('No results found.');
                }
            })
            .catch(error => {
                console.error('There was an error fetching the search data!', error);
            });
    };

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
                       value={searchTerm}
                       onChange={handleSearchChange}
                />
                <img className="headerImg" src={searchImage} onClick={handleSearchClick} alt="search"/>
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

            <div id="hot">
                <hr/>
                <p>오늘의 Hot 한 메뉴</p>
                <Carousel interval={2000}> {/* interval은 슬라이드 전환 간격을 밀리초 단위로 설정 */}
                    <Carousel.Item>
                        <img src={one}/>
                        <div className="d-block w-100">닭갈비</div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={two}/>
                        <div className="d-block w-100">닭볶음탕</div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={three}/>
                        <div className="d-block w-100">짜장면</div>
                    </Carousel.Item>
                </Carousel>
            </div>


            {/*/!*검색어 있을 경우*!/*/}
            {/*<section className="recent-searches">*/}
            {/*    <div className="recent-header">*/}
            {/*        <span>최근 검색어</span>*/}
            {/*        <button className="clear-all">모두 지우기</button> /!*누르면 전체 검색어 지워짐*!/*/}
            {/*    </div>*/}
            {/*    <ul className="recent-list">*/}
            {/*        <li className="recent-item">/!*검색한 개수만큼*!/*/}
            {/*            <div>*/}
            {/*                <img src={searchBtn}/>*/}
            {/*                <span>최근 검색어/!*최근 검색어*!/</span>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <span className="date">00.00/!*날짜*!/</span>*/}
            {/*                <button className="clear-item">X</button> /!*누르면 해당 검색어 지워짐*!/*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</section>*/}
        </div>
    );
}

export default Search;
