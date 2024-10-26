import React, { useState, useEffect } from 'react';
import './Style.css';
import axios from 'axios';
import logoImage from '../img/semohan-logo.png';
import { useNavigate } from "react-router-dom";
import LogoHeader from "./LogoHeader";
import HeaderBFLogin from "./HeaderBFLogin";

function FindId() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [certificationNum, setCertificationNum] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (phoneNumber.length === 11) {
            setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        } else if (phoneNumber.length === 13) {
            setPhoneNumber(
                phoneNumber
                    .replace(/-/g, '')
                    .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            );
        }
    }, [phoneNumber]);

    const sendCertificationNum = async () => {
        try {
            const response = await axios.post('auth/find-id/send', { phoneNumber: phoneNumber }, { withCredentials: true });
            if (response.data) {
                alert('인증번호가 전송되었습니다.');
            } else {
                alert('인증번호 전송에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            setError(error.response.data.message); // 백엔드에서 온 오류 메시지 설정
            alert(error.response.data.message);  // 오류 메시지를 팝업으로 띄우기
        }
    };

    const handleFindId = async () => {
        try {
            const response = await axios.post('auth/find-id/confirm', {
                phoneNumber,
                verificationCode: certificationNum
            }, { withCredentials: true });
            if (response.data) {
                alert('인증 성공');
                navigate('/resultId', { state: { userId: response.data } });
            } else {
                alert('인증 실패');
            }
        } catch (error) {
            console.error(error);
            setError(error.response.data.message); // 백엔드에서 온 오류 메시지 설정
            alert(error.response.data.message);  // 오류 메시지를 팝업으로 띄우기
        }
    };

    return (
        <div id="body">
            <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
            <div className="mobile">
                <HeaderBFLogin/>

                <form id="findId" action="" method="post" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="phoneNumber">휴대전화</label>
                    <div className="certification">
                        <input
                            className="blank"
                            type="tel"
                            name="phoneNumber"
                            id="certiPhone1"
                            autoComplete="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)} />
                        <input className="certi" type="button" value="인증번호 요청" onClick={sendCertificationNum} />
                    </div>
                    <div className="certification">
                        <input
                            className="blank"
                            type="text"
                            name="certificationNum"
                            placeholder="인증번호를 입력하세요"
                            id="certiPhone1"
                            value={certificationNum}
                            onChange={(e) => setCertificationNum(e.target.value)} />
                    </div>
                    <div className='find'>
                        <button type="button" onClick={handleFindId}>아이디 찾기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FindId;
