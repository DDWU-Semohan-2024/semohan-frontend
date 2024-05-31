import React from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import my from '../img/profile-user.png';
import search from "../img/search.png";
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";

function ScrapRestaurant() {
    const navigate = useNavigate();
    return (
        <div id="body">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/login')} alt="profile"/>
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
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