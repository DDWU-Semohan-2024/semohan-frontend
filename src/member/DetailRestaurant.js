import React from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";
import like from "../img/like.png";
import example from "../img/buffetjpg.jpg";
import bookmarkImage from "../img/bookmark-white.png";
import triangle from "../img/triangle.png";

function DetailRestaurant() {

    const navigate = useNavigate();
    return (
        <div id="newBody">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/login')} alt="profile"/>
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>
            <div id="content">
                <section id="top">
                    <div id="menuBox">
                        <div>
                            <img className="last" src={triangle} alt="저번주" onClick={() => console.log('저번주 버튼 클릭')}/>
                            <div>점심{/*{restaurant.mealType}*/}</div>
                            <img className="next" src={triangle} alt="다음주" onClick={() => console.log('다음주 버튼 클릭')}/>
                        </div>
                        <span></span>
                        <div className='title'>
                            메인 메뉴
                        </div>
                        {/*메인 개수 따라서 늘어남*/}
                        <div className='menuName'>
                            고등어조림{/*{restaurant.mainMenu}*/}
                        </div>
                        <div className='title'>
                            반찬
                        </div>
                        {/*반찬 개수 따라서 늘어남*/}
                        <div className='menuName'>
                            계란말이{/*{restaurant.subMenu}*/}
                        </div>
                        {/*<div className='menuName'>*/}
                        {/*    계란말이/!*{restaurant.subMenu}*!/*/}
                        {/*</div>*/}
                        {/*<div className='menuName'>*/}
                        {/*    계란말이/!*{restaurant.subMenu}*!/*/}
                        {/*</div>*/}
                        {/*<div className='menuName'>*/}
                        {/*    계란말이/!*{restaurant.subMenu}*!/*/}
                        {/*</div>*/}

                    </div>
                    <div id="right">
                        <button id="reviewBox">
                            리뷰
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
                            <img className="bookmark-image" src={bookmarkImage} onClick={{/*클릭마다 사진 바뀜, 스크랩 등록+취소*/}}/>
                        </div>
                        <span>
                            <div className="detail">식당 이름{/*{restaurant.name}*/}</div>
                            주소 : 서울시 성북구 월곡동 {/*restaurant.address*/}
                            <br/>
                            전화번호 : 02-0000-0000 {/*restuarant.phoneNum*/}
                            <br/>
                            영업 시간 : 08시 - 20시 {/*restaurant.businessHours*/}
                            <br/>
                            가격 : 8000원 {/*restaurant.price*/}
                        </span>
                    </div>
                </section>
            </div>

        </div>
    );
}

export default DetailRestaurant;
