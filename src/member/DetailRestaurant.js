import React, { useCallback, useEffect, useState } from 'react';
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

// import ProfileSearchHeader from './ProfileSearchHeader';

import ProfileSearchHeader from './ProfileSearchHeader';



function DetailRestaurant() {

    const navigate = useNavigate();
    const [scrapImage, setScrapImage] = useState(noScrap);
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [menuData, setMenuData] = useState(null);
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null); // 핀한 식당 목록 상태
    const { restaurantId } = useParams(); // 경로 매개변수에서 id 가져오기
    const [restaurantDetails, setRestaurantDetails] = useState(null); // 식당 세부 정보 상태
    const [scrapStatus, setScrapStatus] = useState(false); // 스크랩 상태 추가

    const handelScrap = () => {
        if (scrapStatus) {
            axios.post(`/restaurant/delete-scrap/${restaurantId}`)
                .then(response => {
                    if (response.data) {
                        setScrapImage(noScrap);
                        setScrapStatus(false);
                    }
                })
                .catch(error => {
                    console.error("스크랩 취소 중 오류가 발생했습니다!", error);
                });
        } else {
            axios.post(`/restaurant/scrap/${restaurantId}`)
                .then(response => {
                    if (response.data) {
                        setScrapImage(scrap);
                        setScrapStatus(true);
                    }
                })
                .catch(error => {
                    console.error("스크랩 중 오류가 발생했습니다!", error);
                });
        }
    };

    const checkLoginStatus = useCallback(() => {
        axios.get('/member/info', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setLoggedIn(true);
                }
            }).catch(error => {

            console.error("로그인 상태 확인 중 오류가 발생했습니다!", error);
        });

            //     console.error("로그인 상태 확인 중 오류가 발생했습니다!", error);
            // });

    }, []);

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

    // const fetchScrapStatus = async () => {
    //     try {
    //         const response = await axios.get('/restaurant/scrap-pin', { withCredentials: true });
    //         const { scrappedRestaurnats } = response.data;
    //         const isScrapped = scrappedRestaurnats.some(rest => rest.id === Number(restaurantId));
    //         setScrapStatus(isScrapped);
    //         setScrapImage(isScrapped ? scrap : noScrap); // 초기 스크랩 상태 설정
    //     } catch (error) {
    //
    //     } catch (error) {
    //         console.error('식당 세부 정보를 가져오는 중 오류가 발생했습니다:', error);
    //     }
    // };

    const fetchScrapStatus = async () => {
        try {
            const response = await axios.get('/restaurant/scrap-pin', { withCredentials: true });
            const { scrappedRestaurnats } = response.data;
            const isScrapped = scrappedRestaurnats.some(rest => rest.id === Number(restaurantId));
            setScrapStatus(isScrapped);
            setScrapImage(isScrapped ? scrap : noScrap); // 초기 스크랩 상태 설정
        } catch (error) {

            console.error('스크랩 상태를 확인하는 중 오류가 발생했습니다!', error);
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
        fetchMenuData(currentDate);
        fetchRestaurantDetails(); // 컴포넌트 마운트 시 식당 세부 정보 가져오기
        fetchScrapStatus(); // 스크랩 상태 확인
    }, [restaurantId]);

    useEffect(() => {
        fetchMenuData(currentDate); // 날짜 변경 시 메뉴 데이터 가져오기
    }, [currentDate]);

    useEffect(() => {
        checkLoginStatus(); // 컴포넌트 마운트 시 로그인 상태 확인
    }, [checkLoginStatus]);

    const formattedDate = currentDate.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환

    return (
        <div id="newBody">


            {/*<header>*/}
            {/*    <Link to="/main"><img src={logoImage} alt="logo"/></Link>*/}
            {/*</header>*/}

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
                        {/*{menuData ? (*/}
                        {/*    <div>*/}
                        {/*        <div id='meal'>점심</div>*/}
                        {/*        <div className='title'>*/}
                        {/*            메인 메뉴*/}
                        {/*        </div>*/}
                        {/*        {menuData.mainMenu && menuData.mainMenu.map((item, index) => (*/}
                        {/*            <div className='menuName' key={index}>*/}
                        {/*                {item}*/}
                        {/*            </div>*/}
                        {/*        ))}*/}
                        {/*        <div className='title'>*/}
                        {/*            반찬*/}
                        {/*            </div>*/}
                        {/*        {menuData.subMenu.map((item, index) => (*/}
                        {/*            <div className='menuName' key={index}>*/}
                        {/*                {item}*/}
                        {/*            </div>*/}
                        {/*        ))}*/}
                        {/*        /!*    <div id='meal'>저녁</div>*!/*/}
                        {/*        /!*    <div className='title'>*!/*/}
                        {/*        /!*        메인 메뉴*!/*/}
                        {/*        /!*    </div>*!/*/}
                        {/*        /!*    {menuData.mainMenu.map((item, index) => (*!/*/}
                        {/*        /!*        <div className='menuName' key={index}>*!/*/}
                        {/*        /!*            {item}*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    ))}*!/*/}
                        {/*        /!*    <div className='title'>*!/*/}
                        {/*        /!*        반찬*!/*/}
                        {/*        /!*    </div>*!/*/}
                        {/*        /!*    {menuData.subMenu.map((item, index) => (*!/*/}
                        {/*        /!*        <div className='menuName' key={index}>*!/*/}
                        {/*        /!*            {item}*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    ))}*!/*/}
                        {/*    </div>*/}
                        {/*) : (*/}
                        {/*    <div>아직 등록된 메뉴가 없습니다.</div>*/}
                        {/*)}*/}
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
                            <img className="resImg" src={example} alt="restaurant" />
                            <img className="bookmark-image2" src={scrap} onClick={handelScrap} alt="bookmark"/>
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
    );
}

export default DetailRestaurant;