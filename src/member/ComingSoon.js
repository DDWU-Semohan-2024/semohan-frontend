import React from 'react';
import './Style.css'; // CSS 파일을 import
import logoImage from '../img/semohan-logo.png';
import {Link} from "react-router-dom";

function ComingSoon() {
    return (
        <div id="body">
            <header>
                <Link to="/myPage"><img src={logoImage} alt="logo"/></Link>
            </header>
            <div id="result">
                아직 준비중인 페이지입니다.
            </div>
            <div id="result">
                Coming Soon...
            </div>
        </div>
    );
}

export default ComingSoon;
