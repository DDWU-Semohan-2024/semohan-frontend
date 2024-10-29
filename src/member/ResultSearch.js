import React, {useCallback, useContext, useEffect, useState} from 'react';
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
import ProfileHeader from './ProfileHeader';
import ScrapContext from './ScrapContext'; // ScrapContext import

function ResultSearch() {
    const navigate = useNavigate();
    // const { scrapStatus, updateScrapStatus } = useContext(ScrapContext); // ScrapContext 사용

    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // const [scrapImage, setScrapImage] = useState(noScrap);

    const [searchType, setSearchType] = useState(''); // 검색 타입 추가

    const [scrapImages, setScrapImages] = useState([noScrap, noScrap]); // 각 핀의 스크랩 이미지를 배열로 관리

    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null); // 핀한 식당 목록 상태
    const [pinnedRestaurantName, setPinnedRestaurantName] = useState(''); // 핀한 식당 목록 상태

    const [restaurantName, setRestaurantName] = useState(''); // 핀된 식당 이름 상태

    const [scrappedRestaurants, setScrappedRestaurants] = useState([]);
    const [scrapImage, setScrapImage] = useState(scrap);
    const [restaurants, setRestaurants] = useState([]);

    const { scrapStatus, setScrapStatus, setContextRestaurants  } = useContext(ScrapContext);
    useEffect(() => {
        if (location.state && location.state.results) {
            setSearchResults(location.state.results);
            setSearchType(location.state.searchType);
            setSearchTerm(location.state.searchTerm);
        }
    }, [location.state]);

    const fetchScrapStatus = useCallback(async () => {
        try {
            const response = await axios.get('/restaurant/scrap-pin', { withCredentials: true });
            const scrapList = response.data.scrappedRestaurnats || [];

            setSearchResults(prevSearchResults =>
                prevSearchResults.map(restaurant => ({
                    ...restaurant,
                    isScrapped: scrapList.some(scrap => scrap.id === restaurant.id)
                }))
            );
        } catch (error) {
            console.error("There was an error fetching scrap status!", error);
        }
    }, []);


    const fetchRestaurants = useCallback(async (location) => {
        try {
            const response = await axios.get(`/restaurant/nearby`, {
                withCredentials: true,
                params: { location: location }
            });
            const fetchedRestaurants = response.data;
            // console.log(fetchedRestaurants);
            // 각 식당의 스크랩 상태를 확인하여 설정
            const updatedRestaurants = fetchedRestaurants.map((restaurant) => ({
                ...restaurant,
                isScrapped: loggedIn ? scrapStatus.find(status => status.id === restaurant.id)?.isScrapped || false : false
            }));

            // setRestaurants(updatedRestaurants); // 업데이트된 식당 리스트 설정
            setRestaurants(fetchedRestaurants); // 검색된 식당 리스트 설정

            fetchScrapStatus();
        } catch (error) {
            console.error("There was an error fetching the restaurant data!", error);
        }
    }, [fetchScrapStatus]);

    const checkLoginStatus = useCallback(() => {
        axios.get('/member/info', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setLoggedIn(true);
                    // fetchPinnedRestaurantMenu ();
                    fetchScrapStatus(); // 로그인 시 스크랩 상태 가져오기

                }
            }).catch(error => {
            console.error("There was an error checking login status!", error);
        });
    }, [loggedIn]);

    useEffect(() => {
        if (loggedIn && searchResults.length > 0) {
            // fetchPinnedRestaurantMenu(); // 핀한 식당 메뉴 가져오기
            // fetchPinnedRestaurantName(); // 핀한 식당 이름 가져오기
            fetchRestaurants(); // 로그인 시 레스토랑 불러오기
        }
        // }, [loggedIn, restaurants]);
    }, [loggedIn, searchResults, fetchScrapStatus]);

    useEffect(() => {
        axios.get('/restaurant/scrap-pin')
            .then(response => {
                console.log("스크랩의내용")
                console.log(response.data)
                const data = response.data;

                const pinnedRestaurant = data.pinnedRestaurnat; // 백엔드의 오타 처리

                const scrappedRestaurants = Array.isArray(data.scrappedRestaurnats) ? data.scrappedRestaurnats : [];

                // setPinnedRestaurant(data.pinnedRestaurant);
                setPinnedRestaurant(pinnedRestaurant);
                setScrappedRestaurants(scrappedRestaurants.map(restaurant => ({
                    ...restaurant,
                    scrapped: true,
                    pinned: pinnedRestaurant && pinnedRestaurant.id === restaurant.id // 현재 핀한 식당과 비교
                    // pinned: data.pinnedRestaurant && data.pinnedRestaurant.id === restaurant.id
                })));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


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

    const handleScrap = (restaurantId, isScrapped) => {
        const apiUrl = isScrapped
            ? `/restaurant/delete-scrap/${restaurantId}`
            : `/restaurant/scrap/${restaurantId}`;

        axios.post(apiUrl, {}, { withCredentials: true })
            .then(() => {
                setSearchResults(prevSearchResults =>
                    prevSearchResults.map(restaurant =>
                        restaurant.id === restaurantId
                            ? { ...restaurant, isScrapped: !isScrapped } // 스크랩 상태 업데이트
                            : restaurant
                    )
                );

                alert(isScrapped ? '스크랩 해제되었습니다.' : '스크랩되었습니다.');
            })
            .catch(error => {
                console.error(isScrapped ? "Error removing scrap!" : "Error adding scrap!", error);
            });
    };


    const updatePinnedScrappedRestaurants = (scrappedRestaurantIdList, pinnedRestaurantId) => {
        const payload = {
            scrappedRestaurantIdList,
            pinnedRestaurantId,
        };

        axios.post('/restaurant/scrap-pin/update', payload, { withCredentials: true })
            .then(response => {
                if (response.data) {
                    console.log("핀 및 스크랩 정보가 성공적으로 업데이트되었습니다.");
                }
            })
            .catch(error => {
                console.error("핀 및 스크랩 정보 업데이트 중 오류가 발생했습니다!", error);
            });
    };

    useEffect(() => {
        // fetchRestaurants(); // Initially fetch restaurants
        checkLoginStatus(); // Check login status on component mount
    }, [checkLoginStatus]);

    useEffect(() => {
        // fetchRestaurants(); // Initially fetch restaurants
        fetchScrapStatus(); // Check login status on component mount
    }, []);
    return (
        <div id="newBody">
            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
                <ProfileHeader />


                <div id="searchBar">
                    <img src={toMain} alt="toMain" onClick={() => navigate('/search')}/>
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
                                        <img className="resImg" src={restaurant.s3Url} alt="search"
                                             onClick={() => handleImageClick(restaurant.id)}/>
                                        <img className="bookmark-image2" src={restaurant.isScrapped ? scrap : noScrap}
                                             onClick={() => handleScrap(restaurant.id, restaurant.isScrapped)}
                                             alt="bookmark"/>
                                        <span className="image-caption">{restaurant.name}</span>
                                    </div>
                                ))
                        ) : (
                            <div>검색 결과가 없습니다.</div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultSearch;
