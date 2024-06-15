import React, {useEffect, useState} from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from '../img/toMain.png';
import searchBtn from '../img/search.png';
import one from '../img/1.png';
import two from '../img/2.png';
import three from '../img/3.png';
import { Carousel } from 'react-bootstrap';
import axios from "axios";
import qs from "qs";

function Search() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    //const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState(''); // 검색 타입 추가
    const [todayDate, setTodayDate] = useState('');
    const [tomorrowDate, setTomorrowDate] = useState('');
    const [searchDate, setSearchDate] = useState(todayDate);

    const [searchResults, setSearchResults] = useState([]); // 검색 결과 저장용

    const setSearchTypeAndDate = (type, date = todayDate) => {
        setSearchType(type);
        setSearchDate(date);
    };

    //const [restaurant, setRestaurant] = useState([]);
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();

        tomorrow.setDate(today.getDate() + 1);

        const todayFormatted = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
        const tomorrowFormatted = `${tomorrow.getFullYear()}.${tomorrow.getMonth() + 1}.${tomorrow.getDate()}`;

        setTodayDate(todayFormatted);
        setTomorrowDate(tomorrowFormatted);
    }, []);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        console.log(e.target.value);
    };


    const handleSearchClick = (type, date) => {
        let searchTypeValue = type || searchType;
        let params = {};

        if (searchTypeValue === 'name') {
            params = {...params, name: searchTerm};
            console.log("search type: name")
        } else if (searchTypeValue === 'location') {
            params = {...params, location: searchTerm};
            console.log("search type: location")
        } else if (searchTypeValue === 'menu') {
            params = {menu: searchTerm, date: searchDate};
            console.log("search type: menu")
        } else {
            params = {
                ...params,
                location: searchTerm,
                menu: searchTerm,
                name: searchTerm
            };
        }
        // else {
        //     params = {
        //         location: searchTerm,
        //         menu: searchTerm,
        //         name: searchTerm
        //     };
        // }
        axios.defaults.paramsSerializer = params => {
            return qs.stringify(params);
        }


        axios.get('/restaurant/search', {params})
            .then(response => {
                console.log('Response Data :', response.data);  // 응답 데이터 로그 추가
                console.log('Response :', response);  // 응답 데이터 로그 추가

                if (response.data && response.data.length > 0) {
                    setSearchResults(response.data);
                    // response.data.forEach(item => {
                    //     if (item.id) {
                    //         console.log('Item ID:', item.id);
                    //     }
                    // });
                    navigate('/resultSearch', {state: {results: response.data}});
                } else {
                    console.log('No results found.');
                    setSearchResults([]); // 검색 결과가 없으면 빈 배열로 설정

                }
            })
            .catch(error => {
                console.error('There was an error fetching the search data!', error);
            });


        console.log('Searching for:', searchTerm, 'with type:', searchTypeValue, 'on date:', date);  // 콘솔 로그 추가

    };

    return (
        <div id="newBody">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>

            <div id="searchBar">
                <img src={toMain} alt="toMain" onClick={() => navigate('/main')}/>
                <input type="text"
                       name="search"
                       className="search"
                       placeholder="지역, 음식 또는 식당 입력"
                       value={searchTerm}
                       onChange={handleSearchChange}
                />
                {/*<img className="headerImg" src={searchBtn} onClick={() => handleSearchClick()} alt="search"/>*/}

                <img className="headerImg" src={searchBtn} onClick={handleSearchClick} alt="search"/>
                <img className="headerImg" src={searchBtn} onClick={() => handleSearchClick()} alt="search"/>

            </div>
            <div className="search-options">
                <div>
                    <button className="search-option lemon"
                            onClick={() => setSearchTypeAndDate('menu', todayDate)}>오늘 메뉴 검색
                    </button>
                    <button className="search-option gray"
                            onClick={() => setSearchTypeAndDate('menu', tomorrowDate)}>내일 메뉴 검색
                    </button>
                </div>
                <div>
                    <button className="search-option gray"
                            onClick={() => setSearchTypeAndDate('location')}
                    >지역명 검색
                    </button>
                    <button className="search-option gray"
                            onClick={() => {
                                setSearchTypeAndDate('name')
                            }}>식당명 검색
                    </button>
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

            <div id="searchResults">
                {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div key={index} className="search-result-item">
                            <h3>{result.name}</h3>
                            <p>위치: {result.location}</p>
                            <p>메뉴: {result.menu}</p>
                        </div>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
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
