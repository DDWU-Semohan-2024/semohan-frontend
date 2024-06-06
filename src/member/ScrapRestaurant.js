import React, {useState} from 'react';
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
    const [pinImages, setPinImages] = useState([noPin, noPin]); // 각 핀의 스크랩 이미지를 배열로 관리
    const [pinImage, setPinImage] = useState(pin);

    const handleScrap = (index) => {
        setPinImages(prevImages =>
            prevImages.map((img, i) => (i === index ? (img === noPin ? pin : noPin) : img))
        );
    }

    const handlePin = () => {
        setPinImage((prevSrc) => (prevSrc === pin ? noPin : pin));
    }

    return (
        <div id="newBody">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/myPage')} alt="profile"/>
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>

            <div id="main_noLogin">
                <h4>내가 핀한 식당</h4>
                {/*있을 경우*/}
                <div className="image-grid">
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={pinImage} onClick={handlePin}/>
                        <span className="image-caption" onClick={() => navigate('/detailRestaurant')}>뷔페1</span>
                    </div>
                </div>
                {/*없을 경우*/}
                <div className="pin">
                    단골 식당을 <span>PIN</span> 해주세요
                </div>

                <h4>내가 스크랩한 식당</h4>
                <div className="image-grid">
                    {pinImages.map((img, index) => (
                        <div className="image-container" key={index}>
                            <img className="resImg" src={example/*식당사진*/} alt="search"/>
                            <img
                                className="bookmark-image"
                                src={img}
                                onClick={() => handleScrap(index)}
                                alt="bookmark"
                            />
                            <span className="image-caption" onClick={() => navigate('/detailRestaurant')}>뷔페{index + 1}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default ScrapRestaurant;