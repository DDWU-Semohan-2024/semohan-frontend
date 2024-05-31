import React, { useState } from 'react';
import './Style.css';
import logoImage from '../img/semohan-logo.png';
import lock from "../img/lock.png"
import beforeCheck from "../img/free-icon-checkmark-656971.png"
function NewPassword() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [certificationNum, setCertificationNum] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // 로그인 버튼 클릭시 입력창 reset
        setUsername("");
        setPassword("");
    };

    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo" />
            </header>

            <form id="newPassword" onSubmit={handleSubmit}>

                <label htmlFor="username">아이디</label>
                <input
                    className="blank"
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="password">비밀번호</label>
                <div id="containImg">
                    <input
                        className="blank"
                        type="password"
                        name="pwd"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src={lock} alt="lock"/>
                </div>


                <label htmlFor="passwordCheck">비밀번호 재확인</label>
                <div id="containImg">
                    <input
                        className="blank"
                        type="password"
                        id="passwordCheck"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                    />
                    <img src={beforeCheck} alt="check"/>
                </div>

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
                <input className="submit" type="submit" value="비밀번호 변경"/>
            </form>
        </div>
    );
}

export default NewPassword;