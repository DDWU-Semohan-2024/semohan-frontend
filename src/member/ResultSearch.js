import React, {useContext, useEffect, useState} from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from "../img/toMain.png";
import searchBtn from "../img/search.png";
import searchImage from "../img/search.png";
import example from "../img/buffetjpg.jpg";
import noScrap from "../img/bookmark-white.png";
import scrap from "../img/bookmark.png";
import bookmarkImage from "../img/bookmark-white.png";
import axios from "axios";
import qs from "qs";
import ProfileHeader from './ProfileHeader';
import ScrapContext from './ScrapContext'; // ScrapContext import

function ResultSearch() {
    const navigate = useNavigate();
    const { scrapStatus, updateScrapStatus } = useContext(ScrapContext); // ScrapContext 사용

    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [scrapImage, setScrapImage] = useState(noScrap);
    const handelScrap = () => {
        setScrapImage((prevSrc) => (prevSrc === noScrap ? scrap : noScrap));
    }
    const [searchType, setSearchType] = useState(''); // 검색 타입 추가

    useEffect(() => {
        if (location.state && location.state.results) {
            setSearchResults(location.state.results);
            setSearchType(location.state.searchType);
            setSearchTerm(location.state.searchTerm);
        }
    }, [location.state]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        let params = {};
        if (searchType === 'name') {
            params = {name: searchTerm};
        } else if (searchType === 'location') {
            params = {location: searchTerm};
        } else if (searchType === 'menu') {
            params = {menu: searchTerm};
        } else {
            params = {
                location: searchTerm,
                menu: searchTerm,
                name: searchTerm
            };
        }

        axios.defaults.paramsSerializer = params => {
            return qs.stringify(params);
        }

        axios.get('/restaurant/search', {params})
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setSearchResults(response.data);
                    console.log(response.data);
                    navigate('/resultSearch', {state: {results: response.data, searchType, searchTerm}});
                } else {
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the search data!', error);
            });

        console.log('Searching for:', searchTerm);  // 콘솔 로그 추가


    };

    const handleImageClick = (restaurantId) => {
        navigate(`/detailRestaurant/${restaurantId}`);
    };

    const handleScrapToggle = (restaurantId, index) => {
        const isScrapped = scrapStatus[index]; // 현재 스크랩 상태 가져오기
        updateScrapStatus(restaurantId, !isScrapped); // 스크랩 상태 업데이트
    };

    return (
        <div id="newBody">

            {/*<header>*/}
            {/*    <Link to="/main"><img src={logoImage} alt="logo"/></Link>*/}
            {/*</header>*/}


            <ProfileHeader />


            <div id="searchBar">
                <img src={toMain} alt="toMain" onClick={() => navigate('/main')}/>
                <input type="text"
                       name="search"
                       className="search"
                       // value={검색어}
                       value={searchTerm}
                       onChange={handleSearchChange}
                />
                <img className="headerImg" src={searchImage} onClick={handleSearchClick} alt="search"/>
            </div>

            <div id="main_noLogin">
                <div className="image-grid">
                    {searchResults.length > 0 ? (
                            searchResults.map((restaurant, index) => (

                    <div className="image-container" key={index}>
                        {searchResults.data}
                        <img className="resImg" src={restaurant.s3Url} alt="search"  onClick={() => handleImageClick(restaurant.id)}/>
                        <img className="bookmark-image2" src={bookmarkImage}
                             onClick={() => handleScrapToggle(restaurant.id, index)}
                             alt="스크랩"/>
                        <span className="image-caption">{restaurant.name}</span>
                    </div>
                        ))
                     ) : (
                        <div>검색 결과가 없습니다.</div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default ResultSearch;
