import React, { useState } from 'react';
import "./Style.css"; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import axios from "axios";

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('Username:', username);
        console.log('Password:', password);

        // 로그인 처리 등의 로직 추가
        const data = {
            username,
            password,
        };

        const response = axios.post("/auth/sign-in", data, {
            withCredentials: true
        });


        console.log(response);

        return response;

        // 로그인 버튼 클릭시 입력창 reset
        // setUsername("");
        // setPassword("");
    };

    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo"/>
            </header>

            <form id="login" onSubmit={handleSubmit}>
                <label htmlFor="username">아이디</label>
                <input className="blank" onChange={handleUsernameChange} type="text" id="username"
                       value={username}/>
                <label htmlFor="password">비밀번호</label>
                <input className="blank" onChange={handlePasswordChange} type="password" id="password"
                       value={password}/>
                <input className="submit" type="submit" value="로그인"/>
                <div className="loginLink">
                    <Link to="/findId">아이디 찾기</Link>
                    <Link to="/newPassword">비밀번호 재설정</Link>
                    <Link to="/">회원가입 문의</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;