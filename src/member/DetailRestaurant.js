import React, {useCallback, useEffect, useState} from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate, useParams} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";
import like from "../img/like.png";
import example from "../img/buffetjpg.jpg";
import triangle from "../img/triangle.png";
import noScrap from "../img/bookmark-white.png";
import scrap from "../img/bookmark-black.png";
import axios from "axios";

function DetailRestaurant() {

    const navigate = useNavigate();
    const [scrapImage, setScrapImages] = useState(noScrap);

    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태

    const [currentDate, setCurrentDate] = useState(new Date());
    const [menuData, setMenuData] = useState(null);

    const [pinnedRestaurant, setPinnedRestaurant] = useState(null); // 핀한 식당 목록 상태

    const { restaurantId } = useParams(); // Get the id from the route parameters

    const [restaurantDetails, setRestaurantDetails] = useState(null); // 식당 세부 정보 상태

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
                }
            }).catch(error => {
            console.error("There was an error checking login status!", error);
        });
    }, []);

    const fetchMenuData = async (date) => {
        const formattedDate = currentDate.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환
        try {
            const response = await axios.get(`/menu/${restaurantId}/${formattedDate}`);
            setMenuData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching menu details:', error);
            if (error.response.status === 404) { // 404 (메뉴가 없는 경우)
                alert('메뉴가 준비중입니다.'); // 오류 메시지를 팝업으로 띄우기
            }
        }
    };

    const fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`/restaurant/detail/${restaurantId}`);
            setRestaurantDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        }
    };

    const handlePreviousDay = () => {
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDate);
        fetchMenuData(previousDate); // Fetch menu data for the previous date
    };

    const handleNextDay = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
        fetchMenuData(nextDate); // Fetch menu data for the next date
    };

    useEffect(() => {
        fetchMenuData(currentDate);
        fetchRestaurantDetails(); // Fetch restaurant details on component mount
    }, [restaurantId]);

    useEffect(() => {
        fetchMenuData(currentDate); // Fetch menu data on date change
    }, [currentDate]);

    useEffect(() => {
        checkLoginStatus(); // Check login status on component mount
    }, [checkLoginStatus]);

    const formattedDate = currentDate.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환

    return (
        <div id="newBody">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/login')} alt="profile"/>
                <Link to="/main"><img src={logoImage} alt="logo"/></Link>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>
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
                                <div id='meal'>점심</div>
                                <div className='title'>
                                    메인 메뉴
                                </div>
                                {menuData.mainMenu.map((item, index) => (
                                    <div className='menuName' key={index}>
                                        {item}
                                    </div>
                                ))}
                                <div className='title'>
                                    반찬
                                </div>
                                {menuData.subMenu.map((item, index) => (
                                    <div className='menuName' key={index}>
                                        {item}
                                    </div>
                                ))}
                            {/*    <div id='meal'>저녁</div>*/}
                            {/*    <div className='title'>*/}
                            {/*        메인 메뉴*/}
                            {/*    </div>*/}
                            {/*    {menuData.mainMenu.map((item, index) => (*/}
                            {/*        <div className='menuName' key={index}>*/}
                            {/*            {item}*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            {/*    <div className='title'>*/}
                            {/*        반찬*/}
                            {/*    </div>*/}
                            {/*    {menuData.subMenu.map((item, index) => (*/}
                            {/*        <div className='menuName' key={index}>*/}
                            {/*            {item}*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )}

                    </div>
                    <div id="right">
                        <button id="reviewBox">
                            <Link to="/comingSoon">리뷰</Link>
                        </button>
                        <article id="likeBox">
                            <p>식당 <img src={like}/> {/*좋아요 개수*/}N개</p>
                            <p>오늘 메뉴 <img src={like}/> {/*좋아요 개수*/}N개</p>
                        </article>
                    </div>
                </section>
                <section id="bottom">
                    <div className="image-grid">
                        <div className="image-container">
                            <img className="resImg" src={example/*식당사진*/} alt="search"/>
                            <img className="bookmark-image2" src={scrapImage} onClick={handleScrap}/>
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
