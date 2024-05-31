import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';

function FindIdResult() {
    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
            <div id="result">
                휴대폰 번호와 일치하는 아이디입니다.
            </div>
            <div id="resultId">
                <div>아이디: semohan123</div>
                <div>가입일: 2024.04.01</div>
            </div>
            <div className="btn">
                <Link to="/login">확인</Link>
                <Link to="/newPassword">비밀번호 재설정</Link>
            </div>
        </div>
    );
}

export default FindIdResult;
