import React, {useEffect, useState} from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from "../img/toMain.png";
import searchBtn from "../img/search.png";
import searchImage from "../img/search.png";
import example from "../img/buffetjpg.jpg";
import noScrap from "../img/bookmark-white.png";
import scrap from "../img/bookmark-black.png";
import bookmarkImage from "../img/bookmark-white.png";
import axios from "axios";
import qs from "qs";

function ResultSearch() {
    const navigate = useNavigate();

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
                    navigate('/resultSearch', {state: {results: response.data, searchType, searchTerm}});
                } else {
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the search data!', error);
            });

        console.log('Searching for:', searchTerm);  // 콘솔 로그 추가
        // navigate('/search', { state: { searchTerm: searchTerm } });


        // let params = {};
        // if (searchType === 'name') {
        //     params = { name: searchTerm };
        //     console.log("search type: name")
        // } else if (searchType === 'location') {
        //     params = { location: searchTerm };
        //     console.log("search type: location")
        // } else if (searchType === 'menu') {
        //     params = { menu: searchTerm };
        //     console.log("search type: menu")
        // } else {
        //     params = {
        //         location: searchTerm,
        //         menu: searchTerm,
        //         name: searchTerm
        //     };
        // }
        // else {
        //     params = {
        //         location: searchTerm,
        //         menu: searchTerm,
        //         name: searchTerm
        //     };
        // }
        // axios.defaults.paramsSerializer = params => {
        //     return qs.stringify(params);
        // }
        //
        // axios.get('/restaurant/search', {params})
        //     .then(response => {
        //         console.log('Response Data :', response.data);  // 응답 데이터 로그 추가
        //         console.log('Response :', response);  // 응답 데이터 로그 추가
        //         if (response.data && response.data.length > 0) {
        //             navigate('/resultSearch', { state: { results: response.data } });
        //         } else {
        //             console.log('No results found.');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('There was an error fetching the search data!', error);
        //     });
    };

    const handleImageClick = (restaurantId) => {
        navigate(`/detailRestaurant/${restaurantId}`);
    };

    return (
        <div id="newBody">
            <header>
                <Link to="/main"><img src={logoImage} alt="logo"/></Link>
            </header>
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
                    {/*식당 수만큼*/}
                    {searchResults.map((restaurant, index) => (
                    <div className="image-container" key={index}>
                        <img className="resImg" src={restaurant.s3Url} alt="search"  onClick={() => handleImageClick(restaurant.id)}/>
                        <img className="bookmark-image2" src={bookmarkImage} onClick={{/*클릭마다 사진 바뀜, 스크랩 등록+취소*/}}/>
                        <span className="image-caption">{restaurant.name}</span>
                    </div>
                    ))}
                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}
                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div><div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div><div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default ResultSearch;
