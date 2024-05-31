import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import my from '../img/profile-user.png';
import search from "../img/search.png";

function ScrapRestaurant() {

    let restaurantImage;
    return (
        <div id="body">
            <header>
                <img src={my} alt="toMyPage"/>
                <img src={logoImage} alt="logo"/>
                <img src={search} alt="searchBtn"/>
            </header>
            <section className="pinned-restaurant">
                <h2>내가 핀한 식당</h2>
                {/*있을 경우*/}
                <div className="restaurant-item">
                    <img src={logoImage/*식당 사진*/} className="restaurantImg"/>
                    <span>식당 이름{/*restaurant name*/}</span>
                </div>
            </section>
            <section className="scrapped-restaurants">
                <h2>내가 스크랩한 식당</h2>
                <div className="scrapList">
                    <div className="restaurant-item">
                        <img src={logoImage/*식당 사진*/} className="restaurantImg"/>

                        <span>식당 이름{/*restaurant name*/}</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ScrapRestaurant