import React, {useEffect, useState} from 'react';
import "./Style.css"; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import ProfileImage from '../img/profile-user.png';
import searchImage from '../img/search.png';
import addressImage from '../img/gps.png';
import example from '../img/buffetjpg.jpg';
import bookmarkImage from '../img/bookmark-white.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function MainNoPin() {

    const [address, setAddress] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     axios.get("/location/set/", {
    //         withCredentials: true
    //     }).then(response => {
    //         setAddress(response.data);
    //     }).catch(error => {
    //         console.error("There was an error fetching the address data!", error);
    //     });
    // }, []);

    // if (!address) {
    //     return <div>Loading...</div>;
    // }


    return (
        <div id="newBody">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/myPage')} alt="profile"/>
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>

            <div className="pin">
                단골 식당을 <span>PIN</span> 해주세요
            </div>

            {/*(식당 개수 받아와서) 동적으로 띄울 수 있게 구현할 것*/}

            <div id="main_noLogin">
                <div className="loc">
                    <p><span>{/*위치*/}강남역</span> 인근 한식 뷔페</p>
                    {/*위치권한 물어보기*/}
                    <button className="setLoc">
                        <div className="locationText">위치 설정</div>
                        <img className="locImg" src={addressImage} alt="search"/>
                    </button>
                </div>

                <div className="image-grid">
                    {/*식당 수만큼*/}
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={bookmarkImage} onClick={{/*클릭마다 사진 바뀜, 스크랩 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={bookmarkImage} onClick={{/*클릭마다 사진 바뀜, 스크랩 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
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
    );
}

export default MainNoPin;