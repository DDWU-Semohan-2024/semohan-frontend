import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';

function MyPage() {

    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
            <div id="caption">마이페이지</div>
            <div className="mainLink">
                <Link className="lemon" to="/myInfo">나의 정보</Link>
                <Link className="lemon" to="/comingSoon">리뷰</Link>
                <Link className="lemon" to="/scrapRestaurant">식당 핀/스크랩</Link>
                <Link className="lemon" to="/login">로그아웃</Link>
            </div>
        </div>
    );
}

export default MyPage;
