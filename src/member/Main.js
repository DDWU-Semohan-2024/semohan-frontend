import React, {useCallback, useEffect, useState} from 'react';
import "./Style.css"; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import noLoginImage from '../img/add.png';
import searchImage from '../img/search.png';
import addressImage from '../img/gps.png';
import example from '../img/buffetjpg.jpg';
import noScrap from '../img/bookmark-white.png';
import scrap from '../img/bookmark-black.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import profileImg from "../img/profile-user.png";
import ProfileSearchHeader from './ProfileSearchHeader';

function Main() {
    const [address, setAddress] = useState(null);
    const [restaurants, setRestaurants] = useState([]);

    const navigate = useNavigate();
    const [scrapImages, setScrapImages] = useState([noScrap, noScrap]); // 각 핀의 스크랩 이미지를 배열로 관리

    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null); // 핀한 식당 목록 상태

   const [restaurantName, setRestaurantName] = useState(''); // 핀된 식당 이름 상태

    const handleScrap = (index) => {
        setScrapImages(prevImages =>
            prevImages.map((img, i) => (i === index ? (img === noScrap ? scrap : noScrap) : img))
        );
    }

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

                // response.data의 구조를 확인하여 올바른 경로로 restaurantId 추출
                // const restaurantId = response.data.restaurantId || response.data.restaurant_id || response.data.restaurant?.id;
                // console.log(restaurantId);
                // if (restaurantId) {
                //     fetchRestaurantName(restaurantId); // 식당 이름 가져오기
                // } else {
                //     console.error("restaurantId not found in response", response.data);
                // }

            }).catch(error => {
            console.error("There was an error fetching pinned restaurants!", error);
        });
    };

    // const fetchRestaurantName = (restaurantId) => {
    //     axios.get(`/menu/${restaurantId}`, { withCredentials: true })
    //         .then(response => {
    //             setRestaurantName(response.data.name);
    //             console.log(response.data.name);
    //         }).catch(error => {
    //         console.error("There was an error fetching the restaurant name!", error);
    //     });
    // };

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
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(alterAddress, doSomethingError);
    }, []);
    // useEffect(() => {
    //     axios.get("/location/set/", {
    //         withCredentials: true
    //     }).then(response => {
    //         setAddress(response.data);
    //     }).catch(error => {
    //         console.error("There was an error fetching the address data!", error);
    //     });
    // }, []);

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
                setRestaurants(response.data);
                console.log(response.data);
            }).catch((error) => {
            console.error("There was an error fetching the restaurant data!", error);
        });


    };

    const handleImageClick = (restaurantId) => {
        navigate(`/detailRestaurant/${restaurantId}`);
    };

    if (!restaurants) {
        return <div>Loading...</div>;
    }

    return (
        <div id="newBody">
            <ProfileSearchHeader />

            {/*/!*Pin이 없을 경우*!/*/}
            {/*<div className="pin">*/}
            {/*    단골 식당을 <span>PIN</span> 해주세요*/}
            {/*</div>*/}

            {/*Pin 있을 경우*/}
            {loggedIn && pinnedRestaurant ? (
                <div id="menu">
                    <div>
                        <b>❤{pinnedRestaurant.restaurantName}❤</b>
                    </div>
                    <span></span>
                    <div className='title'>
                        메인 메뉴
                    </div>
                    {Array.isArray(pinnedRestaurant.mainMenu) && pinnedRestaurant.mainMenu.map((menu, idx) => (
                        <div className='menuName' key={idx}>
                            {menu}
                        </div>
                    ))}
                    <div className='title'>
                        반찬
                    </div>
                    {Array.isArray(pinnedRestaurant.subMenu) && pinnedRestaurant.subMenu.map((menu, idx) => (
                        <div className='menuName' key={idx}>
                            {menu}
                        </div>
                    ))}
                </div>
            ) : (
                loggedIn && (
                <div className="pin">
                단골 식당을 <span>PIN</span> 해주세요
                </div>
                )
                )}


            {/*로그인 안했을 경우 + 기본*/}
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
                            <img className="bookmark-image2" src={scrapImages} onClick={() => {/* 클릭마다 사진 바뀜, 스크랩 등록+취소 */
                            }}/>
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
    )

}

export default Main;