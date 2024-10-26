import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import './Style.css';

import {Link, useNavigate} from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';

import logoImage from '../img/semohan-logo.png';
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";
import pin from "../img/pin.png";
import noPin from "../img/noPin.png";
import noScrap from "../img/bookmark-white.png";
import scrap from "../img/bookmark-black.png";

// import LogoHeader from './LogoHeader';

import LogoHeader from './LogoHeader';
import ScrapContext from "./ScrapContext";


function ScrapRestaurant() {
    const navigate = useNavigate();
    const [scrapImage, setScrapImage] = useState(scrap);
    const [pinImage, setPinImage] = useState(pin);
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null);
    const [scrappedRestaurants, setScrappedRestaurants] = useState([]);

    const [restaurants, setRestaurants] = useState([]);

    const { scrapStatus } = useContext(ScrapContext);

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
                // const scrapList = response.data.scrappedRestaurants || []; // 기본값 설정
                // if (!Array.isArray(restaurants)) {
                //     console.error("Restaurants is not an array:", restaurants);
                //     return; // 추가적인 에러 처리를 수행할 수 있습니다.
                // }
                // const updatedScrapImages = restaurants.map(restaurant =>
                //     scrapList.some(scrap => scrap.id === restaurant.id) ? scrap : noScrap
                // );
                // setScrapImages(updatedScrapImages);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleNoScrap = () => {
        setScrapImage(prevSrc => (prevSrc === scrap ? noScrap : scrap));
    };

    const handleScrap = index => {

        const restaurantToScrap = scrappedRestaurants[index];

        // 스크랩 해제 시 데이터베이스에서 삭제
        if (restaurantToScrap.scrapped) {
            axios.post(`/restaurant/delete-scrap/${restaurantToScrap.id}`)
                .then(response => {
                    console.log('Successfully removed from scrap:', response.data);
                    // 스크랩한 식당 상태 업데이트
                    setScrappedRestaurants(prevStates =>
                        prevStates.filter((_, i) => i !== index) // 해당 인덱스의 식당 제거
                    );
                })
                .catch(error => {
                    console.error('Error removing from scrap:', error);
                });
        } else {
            // 스크랩 추가
            setScrappedRestaurants(prevStates =>
                prevStates.map((restaurant, i) => (
                    i === index ? { ...restaurant, scrapped: true } : restaurant
                ))
            );
        }
    };

    const handlePin = index => {
        alert("Pin 식당을 수정합니다.");


        const newPinnedRestaurant = scrappedRestaurants[index];
        console.log(newPinnedRestaurant)


        // const newPinnedRestaurant = scrappedRestaurants[index];
        // console.log(newPinnedRestaurant)


        // setPinnedRestaurant(newPinnedRestaurant);
        // setScrappedRestaurants(prevStates =>
        //     prevStates.map((restaurant, i) => (
        //         { ...restaurant, pinned: i === index }
        //     ))
        // );

        // 핀 상태를 토글
        // const isAlreadyPinned = pinnedRestaurant && pinnedRestaurant.id === newPinnedRestaurant.id;
        //
        // setPinnedRestaurant(isAlreadyPinned ? null : newPinnedRestaurant);
        setPinnedRestaurant(prev => (prev && prev.id === newPinnedRestaurant.id ? null : newPinnedRestaurant));

        setScrappedRestaurants(prevStates =>
            prevStates.map((restaurant, i) => ({
                ...restaurant,
                pinned: i === index ? !restaurant.pinned : restaurant.pinned
            }))
        );
        // 핀 상태에 따라 이미지 변경
        setPinImage(prev => (prev === pin ? noPin : pin));

        setTimeout(() => {
            const pinnedRestaurantId = newPinnedRestaurant ? newPinnedRestaurant.id : null;

            // const pinnedRestaurantId = isAlreadyPinned ? null : newPinnedRestaurant.id;

            const scrappedRestaurantIdList = scrappedRestaurants
                .filter(restaurant => restaurant.scrapped)
                .map(restaurant => restaurant.id);

            const requestData = {
                pinnedRestaurantId,
                scrappedRestaurantIdList
            };

            axios.post('/restaurant/scrap-pin/update', requestData)
                .then(response => {
                    console.log('Update successful:', response.data);
                })
                .catch(error => {
                    console.error('Error updating data:', error);
                });
        }, 0);
    };

    const handleSave = () => {
        const pinnedRestaurantId = pinnedRestaurant ? pinnedRestaurant.id : null;
        const scrappedRestaurantIdList = scrappedRestaurants
            .filter(restaurant => restaurant.scrapped)
            .map(restaurant => restaurant.id);

        const requestData = {
            pinnedRestaurantId,
            scrappedRestaurantIdList
        };

        axios.post('/restaurant/scrap-pin/update', requestData)
            .then(response => {
                console.log('Update successful:', response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    };

    const handleImageClick = (restaurantId) => {
        navigate(`/detailRestaurant/${restaurantId}`);
    };

    return (
        <div id="scrapBody">
            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
            <LogoHeader/>


            <div id="main_noLogin">
                <h4>내가 핀한 식당</h4>
                <div className="image-grid">
                    {pinnedRestaurant ? (
                        <div className="image-container">
                            {/*{console.log(pinnedRestaurant.s3Url)} /!* 여기 추가 *!/*/ }
                            <img className="resImg" src={pinnedRestaurant.s3Url} alt="search"
                                 onClick={() => handleImageClick(pinnedRestaurant.id)} />
                            <span className="image-caption"
                                  onClick={() => handleImageClick(pinnedRestaurant.id)}>{pinnedRestaurant.name}</span>
                        </div>
                    ) : (
                        <p>핀한 식당이 없습니다.</p> // 핀한 식당이 없을 경우 메시지 추가
                    )}
                </div>

                <h4>내가 스크랩한 식당</h4>
                <div className="image-grid">
                    {scrappedRestaurants.length > 0 ? (
                            scrappedRestaurants.map((restaurant, index) => (
                                <div className="image-container" key={restaurant.id}>
                                    <img className="resImg" src={restaurant.s3Url} alt="search"
                                         onClick={() => handleImageClick(restaurant.id)}/>
                                    <img
                                        className="bookmark-image1"
                                        src={restaurant.scrapped ? scrap : noScrap}
                                        onClick={() => handleScrap(index)}
                                        alt="scrap"
                                    />
                                    <img
                                        className="bookmark-image2"
                                        src={restaurant.pinned ? pin : noPin} // 핀 상태에 따라 이미지 변경
                                        onClick={() => handlePin(index)}
                                        alt="pin"
                                    />
                                    <span className="image-caption"
                                          onClick={() => handleImageClick(restaurant.id)}>{restaurant.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>스크랩한 식당이 없습니다.</p> // 스크랩한 식당이 없을 경우 메시지 추가
                        )}
                    </div>

                    {/*<button className='saveBtn' onClick={handleSave}>저장</button>*/}

                    {/*<button className='submit gray' onClick={handleSave}>저장</button>*/}

                </div>
                <button className='submit' onClick={handleSave}>저장</button>
            </div>
        </div>
    );
}

export default ScrapRestaurant;
