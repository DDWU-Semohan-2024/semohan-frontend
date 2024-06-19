import React, { useEffect, useState } from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';

function MyInfoPage() {
    const [memberInfo, setMemberInfo] = useState({
        name: '',
        username: '',
        nickname: '',
        phoneNumber: '',
        birthday: ''
    });

    useEffect(() => {
        // API 호출
        fetch('member/info', {
            method: 'GET',
            credentials: 'include', // 세션 쿠키를 포함하기 위해 credentials 옵션 추가
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setMemberInfo(data);
        })
        .catch(error => console.error('Error fetching member info:', error));
    }, []);

    return (
        <div id="body">
            <header>
                <Link to="/myPage"><img src={logoImage} alt="logo"/></Link>
            </header>
            <table>
                <caption>나의 정보</caption>
                <tbody>
                <tr>
                    <th>이름</th>
                    <td>{memberInfo.name}</td>
                </tr>
                <tr>
                    <th>아이디</th>
                    <td>{memberInfo.username}</td>
                </tr>
                <tr>
                    <th>생년월일</th>
                    <td>{new Date(memberInfo.birthday).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <th>전화번호</th>
                    <td>{memberInfo.phoneNumber}</td>
                </tr>
                <tr>
                    <th>닉네임</th>
                    <td>{memberInfo.nickname}</td>
                </tr>
                </tbody>
            </table>
            <Link className="submit" to="/updateInfo">정보 수정</Link>
        </div>
    );
}

export default MyInfoPage;