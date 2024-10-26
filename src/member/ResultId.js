import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import LogoHeader from "./LogoHeader";
import HeaderBFLogin from "./HeaderBFLogin";

function FindIdResult() {
    const location = useLocation();
    const { userId } = location.state || {};

    return (
        <div id="body">
            <HeaderBFLogin/>
            <div id="result">
                휴대폰 번호와 일치하는 아이디입니다.
            </div>
            <div id="resultId">
                <div>아이디: {userId}</div>
            </div>
            <div className="btn">
                <Link to="/login">확인</Link>
                <Link to="/newPassword">비밀번호 재설정</Link>
            </div>
        </div>
    );
}

export default FindIdResult;
