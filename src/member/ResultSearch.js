import React from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import toMain from "../img/toMain.png";
import searchBtn from "../img/search.png";
import searchImage from "../img/search.png";
import example from "../img/buffetjpg.jpg";
import bookmarkImage from "../img/bookmark-white.png";

function ResultSearch() {
    const navigate = useNavigate();
    return (
        <div id="newBody">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
            <div id="searchBar">
                <img src={toMain} alt="toMain" onClick={() => navigate('/mainNoLogin')}/>
                <input type="text"
                       name="search"
                       className="search"
                       placeholder="지역, 음식 또는 식당 입력"
                />
                <img className="headerImg" src={searchImage} onClick={() => navigate('/resultSearch')} alt="search"/>
            </div>

            <div id="main_noLogin">
                <div className="image-grid">
                    {/*식당 수만큼*/}
                    <div className="image-container">
                        <img className="resImg" src={example/*식당사진*/} alt="search"/>
                        <img className="bookmark-image" src={bookmarkImage} onClick={{/*클릭마다 사진 바뀜, 스크랩 등록+취소*/}}/>
                        <span className="image-caption">뷔페1</span>
                    </div>
                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}
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

export default ResultSearch;
