import React from 'react';
import './Style.css'; // CSS 파일을 import
import logoImage from '../img/semohan-logo.png';
import {Link} from "react-router-dom";
import LogoHeader from "./LogoHeader";
import HeaderBFLogin from "./HeaderBFLogin";

function ComingSoon() {
    return (
        <div id="body">
            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
                <HeaderBFLogin />
                <div id="result">
                    아직 준비중인 페이지입니다.
                </div>
                <div id="result">
                    Coming Soon...
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;
