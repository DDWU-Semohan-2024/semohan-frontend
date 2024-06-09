import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../img/semohan-logo.png';

function MyPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('auth/sign-out')
            .then(response => {
                if (response.data === true) {
                    navigate('/main');
                }
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    };

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
                <Link className="lemon" onClick={handleLogout}>로그아웃</Link>
            </div>
        </div>
    );
}

export default MyPage;
