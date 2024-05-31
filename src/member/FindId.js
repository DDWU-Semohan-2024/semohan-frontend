import React, {useState} from 'react';
import './Style.css';
// import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import {Link} from "react-router-dom";

function FindId() {
    const [phoneNum, setPhoneNum] = useState('');
    const [certificationNum, setCertificationNum] = useState('');

    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>
            <form id="findId" action="" method="post">
                <label htmlFor="phoneNum">휴대전화</label>
                <div className="certification">
                    <input className="blank" type="tel" name="phoneNum" id="phoneNum" autoComplete="tel"
                           value={phoneNum}
                           onChange={(e) => setPhoneNum(e.target.value)}/>
                    <input className="certi" type="button" value="인증번호"/>
                </div>
                <div className="certification">
                    <input className="blank" type="number" name="certificationNum"
                           placeholder="인증번호를 입력하세요" id="certiPhone"
                           value={certificationNum}
                           onChange={(e) => setCertificationNum(e.target.value)}/>
                    <input className="certi" type="button" value="확인"/>
                </div>
                <div className="find">
                    <Link to="/resultId">아이디 찾기</Link>
                </div>
            </form>
        </div>
    );
}

export default FindId;
