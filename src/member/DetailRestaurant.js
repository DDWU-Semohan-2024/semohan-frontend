import React, { useCallback, useContext, useEffect, useState } from 'react';
import './Style.css'; // CSS 파일을 import
import { Link, useNavigate, useParams } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';

import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";
import like from "../img/like.png";
import example from "../img/buffetjpg.jpg";
import triangle from "../img/triangle.png";
import noScrap from "../img/bookmark-white.png";
import scrap from "../img/bookmark-black.png";
import axios from "axios";
import ScrapContext from './ScrapContext'; // ScrapContext import


// import ProfileSearchHeader from './ProfileSearchHeader';

import ProfileSearchHeader from './ProfileSearchHeader';



function DetailRestaurant() {

    const navigate = useNavigate();
    const [scrapImage, setScrapImage] = useState(noScrap);
    const [scrapImages, setScrapImages] = useState([noScrap, noScrap]); // 각 핀의 스크랩 이미지를 배열로 관리

    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [menuData, setMenuData] = useState(null);
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null); // 핀한 식당 목록 상태
    const { restaurantId } = useParams(); // 경로 매개변수에서 id 가져오기
    const [restaurantDetails, setRestaurantDetails] = useState(null); // 식당 세부 정보 상태
    // const [scrapStatus, setScrapStatus] = useState(false); // 스크랩 상태 추가
    const [scrappedRestaurants, setScrappedRestaurants] = useState([]);

    const { scrapStatus, setScrapStatus, updateScrapStatus, setContextRestaurants  } = useContext(ScrapContext);

    const fetchScrapStatus = useCallback(async () => {
        if(!loggedIn) {
            // setScrapStatus([]);
            setScrapImage(noScrap);
        }

        try {
            const response = await axios.get('/restaurant/scrap-pin', { withCredentials: true });
            const scrapList = response.data.scrappedRestaurnats || [];
            console.log(scrapList)

            const isScrapped = scrapList.some(restaurant => restaurant.id === Number(restaurantId));
            console.log(isScrapped) // 정상작동하는것확인

            setScrapStatus(prevStatus => {
                // const updatedStatus = [...prevStatus]; // 이전 상태 복사
                const updatedStatus = Array.isArray(prevStatus) ? [...prevStatus] : []; // 배열이 아닐 경우 빈 배열로 초기화
                updatedStatus[restaurantId] = isScrapped; // 현재 식당 ID에 대한 상태 업데이트
                return updatedStatus;
            });

            setScrapImage(isScrapped ? scrap : noScrap);

        } catch (error) {
            console.error("There was an error fetching scrap status!", error);
        }
    }, [restaurantId, loggedIn, setScrapStatus]);

    const fetchRestaurants = useCallback(async (location) => {
        try {
            const response = await axios.get(`/restaurant/nearby`, {
                withCredentials: true,
                params: { location: location }
            });
            const fetchedRestaurants = response.data;

            // 각 식당의 스크랩 상태를 확인하여 설정
            const updatedRestaurants = fetchedRestaurants.map((restaurant) => ({
                ...restaurant,
                isScrapped: loggedIn ? scrapStatus.find(status => status.id === restaurant.id)?.isScrapped || false : false
            }));

            // setRestaurants(updatedRestaurants); // 업데이트된 식당 리스트 설정
            fetchScrapStatus();
        } catch (error) {
            console.error("There was an error fetching the restaurant data!", error);
        }
    }, [loggedIn, scrapStatus]);

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

    const handleScrap = async () => {
        // const isScrapped = scrapStatus; // 현재 식당의 스크랩 상태 확인

        const isScrapped = scrapStatus[restaurantId] || false; // 현재 식당의 스크랩 상태 확인

        const apiUrl = isScrapped
            ? `/restaurant/delete-scrap/${restaurantId}`
            : `/restaurant/scrap/${restaurantId}`;

        try {
            await axios.post(apiUrl, {}, { withCredentials: true });
            // setScrapStatus(!scrapStatus);
            // setScrapImage(!scrapStatus ? scrap : noScrap);
            const newScrapStatus = !isScrapped; // 새로운 스크랩 상태
            updateScrapStatus(restaurantId, newScrapStatus);

            // setScrapStatus(newScrapStatus);
            setScrapImage(newScrapStatus ? scrap : noScrap);
            alert(newScrapStatus ? '스크랩되었습니다.' : '스크랩 해제되었습니다.');

            // 상태 업데이트 후 스크랩 상태 재확인 (최신 상태 반영)
            // await fetchScrapStatus();
        } catch (error) {
            console.error(isScrapped ? "Error removing scrap!" : "Error adding scrap!", error);
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


    const fetchMenuData = async (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환

        try {
            const response = await axios.get(`/menu/${restaurantId}/${formattedDate}`);
            setMenuData(response.data);
            console.log('Menu Data:', response.data);
        } catch (error) {
            console.error('메뉴 데이터를 가져오는 중 오류가 발생했습니다:', error);
            if (error.response && error.response.status === 404) { // 404 (메뉴가 없는 경우)
                // alert('메뉴가 준비중입니다.'); // 오류 메시지를 팝업으로 띄우기
                setMenuData({
                    mainMenu: [],
                    subMenu: [],
                    likesMenu: []
                })
            }
        }
    };

    const fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`/restaurant/detail/${restaurantId}`);
            setRestaurantDetails(response.data);
            console.log('Restaurant Details:', response.data);

        } catch (error) {
            console.error('식당 세부 정보를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    const handlePreviousDay = () => {
        //
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDate);
        fetchMenuData(previousDate); // 이전 날짜의 메뉴 데이터를 가져옴
    };

    const handleNextDay = () => {
        //
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
        fetchMenuData(nextDate); // 다음 날짜의 메뉴 데이터를 가져옴
    };

    useEffect(() => {
        checkLoginStatus();
        fetchRestaurantDetails(); // 컴포넌트 마운트 시 식당 세부 정보 가져오기
    }, [restaurantId]);

    useEffect(() => {
        if (loggedIn) {
            fetchScrapStatus(); // 로그인 시에만 스크랩 상태 확인
        }
    }, [loggedIn, restaurantId]);

    useEffect(() => {
        fetchMenuData(currentDate); // 날짜 변경 시 메뉴 데이터 가져오기
    }, [currentDate]);
    const formattedDate = currentDate.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환

    return (
        <div id="newBody">


            {/*<header>*/}
            {/*    <Link to="/main"><img src={logoImage} alt="logo"/></Link>*/}
            {/*</header>*/}

            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
            <ProfileSearchHeader />


            <div id="content">
                <section id="top">
                    <div id="menuBox">
                        <div>
                            <img className="last" src={triangle} alt="어제" onClick={handlePreviousDay}/>
                            <div>{formattedDate}</div>
                            <img className="next" src={triangle} alt="내일" onClick={handleNextDay}/>
                        </div>
                        <span></span>
                        {menuData ? (
                            <div>
                                {menuData.mainMenu.length > 0 && (
                                    <>
                                        <div id='meal'>점심</div>
                                        <div className='title'>메인 메뉴</div>
                                        {menuData.mainMenu.map((item, index) => (
                                            <div className='menuName' key={index}>
                                                {item}
                                            </div>
                                        ))}
                                    </>
                                )}
                                {menuData.subMenu.length > 0 && (
                                    <>
                                        <div className='title'>반찬</div>
                                        {menuData.subMenu.map((item, index) => (
                                            <div className='menuName' key={index}>
                                                {item}
                                            </div>
                                        ))}
                                    </>
                                )}
                                {menuData.mainMenu.length === 0 && menuData.subMenu.length === 0 && (
                                    <div>아직 등록된 메뉴가 없습니다.</div>
                                )}
                            </div>
                        ) : (
                            <div>로딩 중...</div> // 메뉴 데이터가 없을 때 로딩 상태를 표시
                        )}


                    </div>

                    <div id="right">
                        <button id="reviewBox">
                            <Link to={{
                                pathname: `/restaurantReview/${restaurantId}`,
                                state: { restaurantDetails }
                            }}>리뷰</Link>
                        </button>
                        <article id="likeBox">
                            <p>식당 <img src={like} alt="like" /> {restaurantDetails ? restaurantDetails.likesRestaurant : '0'}개</p>
                            <p>오늘 메뉴 <img src={like} alt="like" /> {menuData ? menuData.likesMenu : '0'}개</p>
                        </article>
                    </div>
                </section>
                <section id="bottom">
                    <div className="image-grid">
                        <div className="image-container">
                            {/*<img className="resImg" src={restaurantDetails.s3Url} alt="restaurant" />*/}
                            {restaurantDetails && restaurantDetails.s3Url ? (
                                <img className="resImg" src={restaurantDetails.s3Url} alt="restaurant" />
                            ) : (
                                <div>이미지를 불러오는 중...</div>
                            )}
                            <img className="bookmark-image2" src={scrapImage} onClick={handleScrap} alt="bookmark"/>
                        </div>
                        <span>
                             {restaurantDetails ? (
                                 <>
                                     <div className="detail">{restaurantDetails.name}</div>
                                     주소 : {restaurantDetails.address}
                                     <br/>
                                     전화번호 : {restaurantDetails.phoneNum}
                                     <br/>
                                     영업 시간 : {restaurantDetails.businessHours}
                                     <br/>
                                     가격 : {restaurantDetails.price}
                                 </>
                             ) : (
                                 <div>Loading...</div>
                             )}
                        </span>
                    </div>
                </section>
            </div>
        </div>
        </div>
    );
}

export default DetailRestaurant;