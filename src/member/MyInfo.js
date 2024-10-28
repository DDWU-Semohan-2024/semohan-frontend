import React, { useEffect, useState } from 'react';
import './Style.css'; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import LogoHeader from './LogoHeader';

function MyInfoPage() {
    const [memberInfo, setMemberInfo] = useState({
        name: '',
        username: '',
        nickname: '',
        phoneNumber: '',
        birthday: '',
        point: 0 // 포인트 초기값 추가
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

            {/*<header>*/}
            {/*    <Link to="/main"><img src={logoImage} alt="logo"/></Link>*/}
            {/*</header>*/}

            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
                <LogoHeader/>

                <table>
                    <caption id='caption'>나의 정보</caption>
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
                    <tr>
                        <th>포인트</th>
                        <td>{memberInfo.point}</td>
                    </tr>
                    </tbody>

                </table>
                <div id="btn-container">
                    <Link className="submit" to="/updateInfo">정보 수정</Link>
                </div>


            </div>
        </div>
    );
}

export default MyInfoPage;
