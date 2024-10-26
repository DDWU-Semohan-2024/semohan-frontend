import React from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import LogoHeader from './LogoHeader';
import HeaderBFLogin from "./HeaderBFLogin";

function GeneratePassword() {
    return (
        <div id="body">
            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
                <HeaderBFLogin/>
                <div id="result">
                    임시 비밀번호가 발급되었습니다.
                </div>
                <div className="btn">
                    <Link to="/login">확인</Link>
                </div>
            </div>
        </div>
    );
}

export default GeneratePassword;
