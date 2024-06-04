import React from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";
import example from "../img/buffetjpg.jpg";
import pin from "../img/pin.png";
import noPin from "../img/noPin.png";

function ScrapRestaurant() {
    const navigate = useNavigate();
    return (
        <div id="newBody">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/myPage')} alt="profile"/>
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>

            <div id="main_noLogin">
                <h4>내가 핀한 식당</h4>
                <div className="image-grid">
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={pin} onClick={{/*클릭마다 사진 바뀜, 핀 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
                </div>
                <h4>내가 스크랩한 식당</h4>
                <div className="image-grid">
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={noPin} onClick={{/*클릭마다 사진 바뀜, 핀 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={noPin} onClick={{/*클릭마다 사진 바뀜, 핀 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={noPin} onClick={{/*클릭마다 사진 바뀜, 핀 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={noPin} onClick={/!*클릭마다 사진 바뀜, 핀 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>

    );
}

export default ScrapRestaurant;