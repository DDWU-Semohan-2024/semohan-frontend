import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";
import pin from "../img/pin.png";
import noPin from "../img/noPin.png";
import noScrap from "../img/bookmark-white.png";
import scrap from "../img/bookmark-black.png";
import LogoHeader from './LogoHeader';

function ScrapRestaurant() {
    const navigate = useNavigate();
    const [scrapImage, setScrapImage] = useState(scrap);
    const [pinImage, setPinImage] = useState(pin);
    const [pinnedRestaurant, setPinnedRestaurant] = useState(null);
    const [scrappedRestaurants, setScrappedRestaurants] = useState([]);

    useEffect(() => {
        axios.get('/restaurant/scrap-pin')
            .then(response => {
                const data = response.data;
                setPinnedRestaurant(data.pinnedRestaurnat);
                setScrappedRestaurants(data.scrappedRestaurnats.map(restaurant => ({
                    ...restaurant,
                    scrapped: true,
                    pinned: data.pinnedRestaurnat && data.pinnedRestaurnat.id === restaurant.id
                })));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleNoScrap = () => {
        setScrapImage(prevSrc => (prevSrc === scrap ? noScrap : scrap));
    };

    const handleScrap = index => {
        setScrappedRestaurants(prevStates =>
            prevStates.map((restaurant, i) => (
                i === index ? { ...restaurant, scrapped: !restaurant.scrapped } : restaurant
            ))
        );
    };

    const handlePin = index => {
        alert("Pin 식당을 수정합니다.");

        const newPinnedRestaurant = scrappedRestaurants[index];
        console.log(newPinnedRestaurant)

        setPinnedRestaurant(newPinnedRestaurant);
        setScrappedRestaurants(prevStates =>
            prevStates.map((restaurant, i) => (
                { ...restaurant, pinned: i === index }
            ))
        );

        setTimeout(() => {
            const pinnedRestaurantId = newPinnedRestaurant ? newPinnedRestaurant.id : null;
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

    return (
        <div id="newBody">
            <LogoHeader/>
            
            <div id="main_noLogin">
                <h4>내가 핀한 식당</h4>
                <div className="image-grid">
                    {pinnedRestaurant && (
                        <div className="image-container">
                            <img className="resImg" src={pinnedRestaurant.s3Url} alt="search" />
                            <span className="image-caption" onClick={() => navigate('/detailRestaurant')}>{pinnedRestaurant.name}</span>
                        </div>
                    )}
                </div>

                <h4>내가 스크랩한 식당</h4>
                <div className="image-grid">
                    {scrappedRestaurants.map((restaurant, index) => (
                        <div className="image-container" key={restaurant.id}>
                            <img className="resImg" src={restaurant.s3Url} alt="search" />
                            <img
                                className="bookmark-image1"
                                src={restaurant.scrapped ? scrap : noScrap}
                                onClick={() => handleScrap(index)}
                                alt="scrap"
                            />
                            <img
                                className="bookmark-image2"
                                src={noPin}
                                onClick={() => handlePin(index)}
                                alt="pin"
                            />
                            <span className="image-caption" onClick={() => navigate('/detailRestaurant')}>{restaurant.name}</span>
                        </div>
                    ))}
                </div>
                <button className='submit gray' onClick={handleSave}>저장</button>
            </div>
        </div>
    );
}

export default ScrapRestaurant;
