import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import './Style.css';
import logoImage from '../img/semohan-logo.png';

function NewPassword() {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [certificationNum, setCertificationNum] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        if (phoneNumber.length === 11) {
            setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        } else if (phoneNumber.length === 13) {
            setPhoneNumber(
                phoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            );
        }
    }, [phoneNumber]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !phoneNumber || !certificationNum) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const confirmResponse = await axios.post('auth/request-temporary-password/confirm', {
                username: username,
                phoneNumber : phoneNumber,
                verificationCode: certificationNum
            });

            if (confirmResponse.data) {
                alert('임시 비밀번호가 발급되었습니다.');
                navigate('/GeneratePassword'); // 비밀번호 발급 후 이동
            } else {
                alert('임시 비밀번호 발급에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error confirming temporary password:', error);
            setError(error.response.data.message); // 백엔드에서 온 오류 메시지 설정
            alert(error.response.data.message);  // 오류 메시지를 팝업으로 띄우기
        }
    };

    const handleCertificationRequest = async () => {
        if (!username || !phoneNumber) {
            alert('아이디와 휴대전화 번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('auth/request-temporary-password/send', {
                username: username,
                phoneNumber: phoneNumber
            });

            if (response.data) {
                alert('인증번호가 발송되었습니다.');
            } else {
                alert('인증번호 발송에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error sending SMS for reset password:', error);
            setError(error.response.data.message); // 백엔드에서 온 오류 메시지 설정
            alert(error.response.data.message);  // 오류 메시지를 팝업으로 띄우기
        }
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
                    required
                />

                <label htmlFor="phoneNumber">휴대전화</label>
                <div className="certification">
                    <input 
                        className="blank" 
                        type="tel" 
                        name="phoneNumber" 
                        id="phoneNumber" 
                        autoComplete="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <input className="certi" type="button" value="인증번호 요청" onClick={handleCertificationRequest} />
                </div>
                <div className="certification">
                    <input 
                        className="blank" 
                        type="number" 
                        name="certificationNum"
                        placeholder="인증번호를 입력하세요" 
                        id="certiPhone"
                        value={certificationNum}
                        onChange={(e) => setCertificationNum(e.target.value)}
                        required
                    />
                </div>
                <input className="submit" type="submit" value="임시 비밀번호 발급"/>
            </form>
        </div>
    );
}

export default NewPassword;
