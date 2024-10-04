import React, {useCallback, useContext, useEffect, useState} from 'react';
import "./Style.css"; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import noLoginImage from '../img/login.png';
import searchImage from '../img/search.png';
import addressImage from '../img/gps.png';
import example from '../img/buffetjpg.jpg';
import noScrap from '../img/bookmark-white.png';
import scrap from '../img/bookmark-black.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import profileImg from "../img/profile-user.png";
import ProfileSearchHeader from './ProfileSearchHeader';
import ScrapContext from "./ScrapContext";

function Main() {
    const [address, setAddress] = useState(null);
    const [restaurants, setRestaurants] = useState([]);

    // const [scrapStatus, setScrapStatus] = useState([]); // 스크랩 상태 배열 추가

    const navigate = useNavigate();
    const [scrapImages, setScrapImages] = useState([noScrap, noScrap]); // 각 핀의 스크랩 이미지를 배열로 관리

    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null); // 핀한 식당 목록 상태
    const [pinnedRestaurantName, setPinnedRestaurantName] = useState(''); // 핀한 식당 목록 상태

    const [restaurantName, setRestaurantName] = useState(''); // 핀된 식당 이름 상태


    const { scrapStatus, updateScrapStatus, setContextRestaurants  } = useContext(ScrapContext);


    // 스크랩 상태를 서버에서 받아오는 함수 추가
    const fetchScrapStatus = () => {
        axios.get('/restaurant/scrap-pin', { withCredentials: true })
            .then(response => {
                const scrapList = response.data.scrappedRestaurants || [];
                const updatedScrapImages = restaurants.map(restaurant =>
                    scrapList.some(scrap => scrap.id === restaurant.id) ? scrap : noScrap
                );
                setScrapImages(updatedScrapImages); // 스크랩 상태에 따라 이미지 설정
            }).catch(error => {
            console.error("There was an error fetching scrap status!", error);
        });
    };

    const checkLoginStatus = useCallback(() => {
        axios.get('/member/info', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setLoggedIn(true);
                    fetchPinnedRestaurantMenu ();
                }
            }).catch(error => {
            console.error("There was an error checking login status!", error);
        });
    }, []);


    const fetchPinnedRestaurantMenu  = () => {
        axios.get('/menu/pin', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setPinnedRestaurant(response.data);


            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    // 404 에러인 경우
                    console.error("Menu not found: 아직 등록된 메뉴가 없습니다");

                    // setPinnedRestaurant(null); // 또는 빈 데이터로 설정
                    // 핀 설정된 식당의 이름을 가져와서 설정
                    // const pinnedRestaurantName = pinnedRestaurant ? pinnedRestaurant.restaurantName : "핀된 식당 없음";
                    // console.log(pinnedRestaurant.restaurantName)
                    // setPinnedRestaurant(response.data);
                    setPinnedRestaurant({
                        restaurantName: pinnedRestaurantName,
                        mainMenu: [],
                        subMenu: []
                    }); // 빈 메뉴로 설정
                } else {
                    // 그 외의 에러
                    console.error("There was an error fetching pinned restaurants!", error);
                }
            });

    };

    const fetchPinnedRestaurantName = () => {
        axios.get('/restaurant/scrap-pin', { withCredentials: true })
            .then(response => {
                console.log(response.data.pinnedRestaurnat.name)
                // const pinnedRestaurant = response.data.pinnedRestaurant; // 핀한 식당 데이터
                // const pinnedRestaurantName = pinnedRestaurant ? pinnedRestaurant.restaurantName : "핀된 식당 없음"; // 핀한 식당 이름
                setPinnedRestaurantName(response.data.pinnedRestaurnat.name);
            })
            .catch(error => {
                console.error("Error fetching pinned restaurant name!", error);
            });
    };

// useEffect에서 핀한 식당 이름을 가져오는 함수를 호출합니다.
    useEffect(() => {
        if (loggedIn) {
            fetchPinnedRestaurantMenu(); // 핀한 식당 메뉴 가져오기
            fetchPinnedRestaurantName(); // 핀한 식당 이름 가져오기
        }
    }, [loggedIn]);

    const handleScrap = (restaurantId, isScrapped) => {
        // const isScrapped = scrapStatus[index];

        if (!restaurantId || restaurantId === 0) {
            console.error("Invalid restaurantId:", restaurantId);
            return;
        }

        if (isScrapped) {
            // 스크랩 해제 API 호출
            axios.post(`/restaurant/delete-scrap/${restaurantId}`, {}, { withCredentials: true })
                .then(() => {
                    updateScrapStatus(restaurantId, false);
                    alert('스크랩 해제되었습니다.')
                })
                .catch(error => {
                    console.error("Error removing scrap!", error);
                });
        } else {
            // 스크랩 추가 API 호출
            axios.post(`/restaurant/scrap/${restaurantId}`, {}, { withCredentials: true })
                .then(() => {
                    updateScrapStatus(restaurantId, true);
                    alert('스크랩되었습니다.')
                })
                .catch(error => {
                    console.error("Error adding scrap!", error);
                });
        }
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


    const handleLocationSetting = () => {
        // 위치 설정 로직
        navigator.geolocation.getCurrentPosition(alterAddress, doSomethingError);
        console.log('위치 설정 버튼 클릭됨');
    };


    const alterAddress = async (position) => {
        let x = position.coords.longitude; // 테스트를 위해 성북구로 지정 127.04742793253544 ; //
        let y = position.coords.latitude; // 테스트를 위해 성북구로 지정 37.60422583406296; //
    
        console.log(x, y);
        if (x && y) {
            try {
                const result = await axios.get(
                    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
                    {
                        headers: {
                            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`
                        },
                        withCredentials: false
                    }
                );
                // 행정구역의 구 부분만 가져옵니다
                console.log(result);
                if (result.data.documents && result.data.documents.length > 0) {
                    let location = result.data.documents[0].address.region_2depth_name;
                    console.log("location: " + location);
                    setAddress(location);
    
                    try {
                        await axios.get(`/location/set/${encodeURIComponent(location)}`);
                        fetchRestaurants(location); // 주소를 설정한 후 레스토랑을 가져옴
                    } catch (error) {
                        console.error("위치를 설정하는 중 오류가 발생했습니다!", error);
                    }
                } else {
                    console.error("주소 데이터를 찾을 수 없습니다!");
                }
            } catch (error) {
                console.error("주소 데이터를 가져오는 중 오류가 발생했습니다!", error);
            }
        }
    };
    
    const doSomethingError = (error) => {
        console.log('location error', error);
    }

    const requestLocationPermission = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    alterAddress(position);
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        console.error("User denied the request for Geolocation.");
                        alert("위치 권한이 차단되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.");
                    } else {
                        console.error("Geolocation error: ", error);
                    }
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };
    
    // 페이지 로드 시 위치 권한 요청
    useEffect(() => {
        requestLocationPermission();
        // updatePinnedScrappedRestaurants();
        fetchScrapStatus();
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(alterAddress, doSomethingError);
    }, []);

    useEffect(() => {
        fetchRestaurants(); // Initially fetch restaurants
        checkLoginStatus(); // Check login status on component mount
    }, [checkLoginStatus]);

    const fetchRestaurants = (location) => {
        axios.get(`/restaurant/nearby`, {
            withCredentials: true,
            params: { location: location }
        })
            .then((response) => {
                // setRestaurants(response.data);
                console.log(response.data);

                const fetchedRestaurants = response.data;

                // 각 식당의 스크랩 상태를 확인하여 설정
                const updatedRestaurants = fetchedRestaurants.map((restaurant, index) => ({
                    ...restaurant,
                    isScrapped: loggedIn ? (scrapStatus[index] || false) : false // 로그인 상태에 따라 스크랩 상태 설정
                }));

                setRestaurants(updatedRestaurants); // 업데이트된 식당 리스트 설정
            }).catch((error) => {
            console.error("There was an error fetching the restaurant data!", error);
        });


    };

    useEffect(() => {
        // 서버에서 레스토랑 리스트를 가져와서 setRestaurants로 업데이트
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('/restaurant/nearby', { withCredentials: true });
                setRestaurants(response.data);
            } catch (error) {
                console.error("There was an error fetching restaurants!", error);
            }
        };

        fetchRestaurants();
    }, [setRestaurants]);


    const handleImageClick = (restaurantId) => {
        navigate(`/detailRestaurant/${restaurantId}`);
    };

    if (!restaurants) {
        return <div>Loading...</div>;
    }

    return (
        <div id="newBody">

            {/*<header id="newHeader">*/}
            {/*    {!loggedIn ? (*/}
            {/*        <img className="headerImg" src={noLoginImage} onClick={() => navigate('/login')} alt="profile"/>*/}
            {/*    ) : (*/}
            {/*        <img className="headerImg" src={profileImg} onClick={() => navigate('/myPage')} alt="profile"/>*/}
            {/*    )}*/}
            {/*    <Link to="/main"><img src={logoImage} alt="logo"/></Link>*/}
            {/*    <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>*/}
            {/*</header>*/}

            <ProfileSearchHeader />


            {/*/!*Pin이 없을 경우*!/*/}
            {/*<div className="pin">*/}
            {/*    단골 식당을 <span>PIN</span> 해주세요*/}
            {/*</div>*/}

            {/*Pin 있을 경우*/}
            {loggedIn && pinnedRestaurant ? (
                <div id="menu">
                    <div>
                        <b>❤{pinnedRestaurantName}❤</b>
                    </div>
                    <span></span>

                    {/* 메인 메뉴와 반찬이 모두 없을 경우 */}
                    {(
                        (!Array.isArray(pinnedRestaurant.mainMenu) || pinnedRestaurant.mainMenu.length === 0) &&
                        (!Array.isArray(pinnedRestaurant.subMenu) || pinnedRestaurant.subMenu.length === 0)
                    ) ? (
                        <div>아직 등록된 메뉴가 없습니다.</div>
                    ) : (
                        <>
                            {/* 메인 메뉴가 있을 경우에만 메뉴 표시 */}
                            {Array.isArray(pinnedRestaurant.mainMenu) && pinnedRestaurant.mainMenu.length > 0 && (
                                pinnedRestaurant.mainMenu.map((menu, idx) => (
                                    <div className='menuName' key={idx}>
                                        {menu}
                                    </div>
                                ))
                            )}
                            {/* 반찬이 있을 경우에만 반찬 표시 */}
                            {Array.isArray(pinnedRestaurant.subMenu) && pinnedRestaurant.subMenu.length > 0 && (
                                pinnedRestaurant.subMenu.map((menu, idx) => (
                                    <div className='menuName' key={idx}>
                                        {menu}
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            ) : (
                loggedIn && (
                    <div className="pin">
                        단골 식당을 <span>PIN</span> 해주세요
                    </div>
                )
            )}


            {/*로그인 안했s을 경우 + 기본*/}
            <div id="main_noLogin">
                <div className="loc">
                    <p><span>{address}</span> 인근 한식 뷔페</p>
                    {/*위치권한 물어보기*/}
                    <button className="setLoc" onClick={handleLocationSetting}>
                        <div className="locationText">위치 설정</div>
                        <img className="locImg" src={addressImage} alt="search"/>
                    </button>
                </div>

                <div className="image-grid">
                    {/*식당 수만큼*/}
                    {/*{scrapImages.map((img, index) => (*/}
                    {/*    <div className="image-container" key={index}>*/}
                    {/*        <img className="resImg" src={restaurant.s3Url/*식당사진*!/ alt="search"*/}
                    {/*             onClick={() => handleImageClick(restaurant.id)}/>*/}
                    {/*        <img*/}
                    {/*            className="bookmark-image2"*/}
                    {/*            src={img}*/}
                    {/*            onClick={() => handleScrap(index)}*/}
                    {/*            alt="bookmark"*/}
                    {/*        />*/}
                    {/*        <span className="image-caption" onClick={() => navigate('/detailRestaurant')}>뷔페{index + 1}</span>*/}
                    {/*    </div>*/}
                    {/*))}*/}

                    {restaurants.map((restaurant, index) => (
                        <div className="image-container" key={index}>
                            <img className="resImg" src={restaurant.s3Url} alt="search"
                                 onClick={() => handleImageClick(restaurant.id)}/>
                            <img className="bookmark-image2" src={restaurant.isScrapped ? scrap : noScrap}
                                 onClick={() => handleScrap(restaurant.id, restaurant.isScrapped)}
                                 alt="bookmark"/>
                            <span className="image-caption">{restaurant.name}</span>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )

}

export default Main;