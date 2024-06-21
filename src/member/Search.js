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
    const [searchType, setSearchType] = useState('menu'); // 검색 타입 기본값을 'menu'로 설정
    const [todayDate, setTodayDate] = useState('');
    const [tomorrowDate, setTomorrowDate] = useState('');
    const [searchDate, setSearchDate] = useState(todayDate);
    const [activeButton, setActiveButton] = useState(1); // 일단 기본은 1(오늘 메뉴 검색)
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 저장용
    const [hotMenus, setHotMenus] = useState([]); // 핫 메뉴 저장용

    const setSearchTypeAndDate = (type, date, buttonIndex) => {
        setSearchType(type);
        setActiveButton(buttonIndex);
        setSearchDate(date);
    };

    //const [restaurant, setRestaurant] = useState([]);
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();

        tomorrow.setDate(today.getDate() + 1);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환
        };

        const formattedToday = formatDate(today);
        const formattedTomorrow = formatDate(tomorrow);

        setTodayDate(formattedToday);
        setTomorrowDate(formattedTomorrow);
        setSearchDate(formattedToday); // 기본적으로 오늘 날짜로 설정
    }, []);



    useEffect(() => {
        // if (searchType === 'menu' && !searchDate) {
        //     setSearchDate(todayDate);
        // }
    }, [searchType, searchTerm]);


    useEffect(() => {
        // 핫 메뉴 데이터를 백엔드에서 가져오기
        axios.get('menu/hot-menu')
            .then(response => {
                setHotMenus(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the hot menu data!', error);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        console.log(e.target.value);
    };

    const handleSearchClick = () => {
        // let searchTypeValue = type || searchType;
        let params = {};

        if (searchType === 'menu'&& searchTerm) {
            params = {menu: searchTerm}; //
            console.log("search type: menu")
        } else if (searchType === 'name' && searchTerm) {
            params = {name: searchTerm};
            console.log("search type: name")
        } else if (searchType === 'location' && searchTerm) {
            params = {location: searchTerm};
            console.log("search type: location")
        } else {
            console.log('Invalid search type or missing search term/date.');
            alert('검색어를 입력하세요!');
            setSearchResults([]); // 검색 결과가 없으면 빈 배열로 설정
            return;
        }

        axios.defaults.paramsSerializer = params => {
            return qs.stringify(params);
        }

        axios.get('/restaurant/search', {params})
            .then(response => {
                console.log(params);
                console.log('Response Data :', response.data);  // 응답 데이터 로그 추가
                console.log('Response :', response);  // 응답 데이터 로그 추가

                if (response.data && response.data.length > 0) {
                    setSearchResults(response.data);
                    // response.data.forEach(item => {
                    //     if (item.id) {
                    //         console.log('Item ID:', item.id);
                    //     }
                    // });
                    navigate('/resultSearch', {state: {results: response.data, searchType, searchTerm, searchDate}}); //
                    console.log(response.data);
                } else {
                    console.log('No results found.');
                    setSearchResults([]); // 검색 결과가 없으면 빈 배열로 설정
                    navigate('/resultSearch', {state: {results: response.data, searchType, searchTerm, searchDate}}); //
                }
            })
            .catch(error => {
                console.error('There was an error fetching the search data!', error);
            });

        console.log('Searching for:', searchTerm, 'with type:', searchType, 'on date:', searchDate);  // 콘솔 로그 추가 , searchDate
    };

    return (
        <div id="newBody">
            <header>
                <img src={logoImage} alt="logo" onClick={() => navigate('/main')}/>
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

                <img className="headerImg" src={searchBtn} onClick={() => handleSearchClick()} alt="search"/>

            </div>
            <div className="search-options">
                <div>
                    <button className={`search-option ${activeButton === 1 ? 'lemon' : 'gray'}`}
                            onClick={() =>
                                setSearchTypeAndDate('menu', todayDate, 1)
                        }>오늘 메뉴 검색
                    </button>
                    <button className={`search-option ${activeButton === 2 ? 'lemon' : 'gray'}`}
                            onClick={() =>
                                setSearchTypeAndDate('menu', tomorrowDate, 2)
                            }>내일 메뉴 검색
                    </button>
                </div>
                <div>
                    <button className={`search-option ${activeButton === 3 ? 'lemon' : 'gray'}`}
                            onClick={() => setSearchTypeAndDate('location', null, 3)}
                    >지역명 검색
                    </button>
                    <button className={`search-option ${activeButton === 4 ? 'lemon' : 'gray'}`}
                            onClick={() => {
                                setSearchTypeAndDate('name', null, 4)
                            }}>식당명 검색
                    </button>
                </div>
            </div>

            <div id="hot">
                <hr/>
                <p>오늘의 Hot 한 메뉴</p>
                <Carousel interval={2000}> {/* interval은 슬라이드 전환 간격을 밀리초 단위로 설정 */}
                    {hotMenus.length > 0 ? (
                        hotMenus.map((menu, index) => (
                            <Carousel.Item key={index}>
                                <img src={index === 0 ? one : index === 1 ? two : three} alt={`Menu ${index + 1}`}/>
                                <div className="d-block w-100">{menu}</div>
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <img src={one} alt="Placeholder"/>
                            <div className="d-block w-100">데이터 없음</div>
                        </Carousel.Item>
                    )}
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
