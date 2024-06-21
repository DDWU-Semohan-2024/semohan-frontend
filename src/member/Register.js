import React, { useEffect, useState } from 'react';
import './Style.css';
import logoImage from '../img/semohan-logo.png';
import lock from "../img/lock.png";
import beforeCheck from "../img/free-icon-checkmark-656971.png";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import LogoHeader from './LogoHeader';


axios.defaults.withCredentials = true;  // withCredentials 설정 추가

function Register() {
    const [year, setYear] = useState(2000); // 기본 연도를 2000년으로 설정
    const [month, setMonth] = useState(1); // 기본 월을 1월로 설정
    const [date, setDate] = useState(1); // 기본 일을 1일로 설정
    const [certificationNum, setCertificationNum] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');

    const location = useLocation();

    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        name: '',
        phoneNumber: '',
        password: '',
        repeatedPassword: '',
        birthday: ''
    });

    useEffect(() => {
        if (location.state && location.state.user) {
            const { username, nickname, name, phoneNumber, password, birthday } = location.state.user;
            setFormData({
                username: username || '',
                nickname: nickname || '',
                name: name || '',
                phoneNumber: phoneNumber || '',
                password: password || '',
                repeatedPassword: '',
                birthday: birthday || ''
            });
        }
    }, [location.state]);

    const updateBirthday = (newYear, newMonth, newDate) => {
        setFormData((prevData) => ({
            ...prevData,
            birthday: `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDate).padStart(2, '0')}`
        }));
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setYear(newYear);
        updateBirthday(newYear, month, date);
    };

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        updateBirthday(year, newMonth, date);
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        updateBirthday(year, month, newDate);
    };

    const handlePhoneChange = (e) => {
        const numberValue = e.target.value.replace(/[^0-9]/g, '');
        let formattedPhoneNumber = '';
        if (numberValue.length === 11) {
            formattedPhoneNumber = numberValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (numberValue.length === 13) {
            formattedPhoneNumber = numberValue.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else {
            formattedPhoneNumber = numberValue;
        }
        setFormData({
            ...formData,
            phoneNumber: formattedPhoneNumber
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSendSms = async () => {
        try {
            const response = await axios.post('auth/sign-up/send', { phoneNumber: formData.phoneNumber }, { withCredentials: true });

            if (response.status === 200) {
                alert('인증번호가 전송되었습니다.');
            } else {
                alert('인증번호 전송에 실패했습니다.');
            }
        } catch (error) {
            console.error('인증번호 전송 중 오류 발생:', error);
            alert('인증번호 전송 중 오류가 발생했습니다.');
        }
    };

    const handleCertificationSubmit = async () => {
        try {
            const response = await axios.post('auth/sign-up/confirm', {
                phoneNumber: formData.phoneNumber,
                verificationCode: certificationNum
            }, { withCredentials: true });

            if (response.status === 200) {
                setIsVerified(true);
                alert('인증이 완료되었습니다.');
            } else {
                alert('인증에 실패하였습니다.');
            }
        } catch (error) {
            console.error('인증 중 오류 발생:', error);
            if (error.response) {
                setError(error.response.data.message);
                alert(error.response.data.message);
            } else {
                alert('인증 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.nickname || !formData.name || !formData.phoneNumber || !formData.password || !formData.repeatedPassword || !formData.birthday) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert('비밀번호는 영문자와 숫자를 포함하여 8자리 이상이어야 합니다.');
            return;
        }

        if (formData.password !== formData.repeatedPassword) {
            alert('비밀번호를 다시 확인하세요');
            return;
        }
        if (!isVerified) {
            alert('휴대전화 인증을 완료해주세요.');
            return;
        }

        try {
            const response = await axios.post('auth/sign-up/submit', formData, { withCredentials: true });

            if (response.status === 200) {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login';
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('회원가입 중 오류가 발생했습니다.');
            }
        }
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => 1940 + i);

    return (
        <div id="body">
            <LogoHeader/>

            <form id="updateInfo" method="post" action="" onSubmit={handleSubmit}>

                <label htmlFor="username">아이디</label>
                <input
                    className="blank"
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    placeholder="아이디"
                    onChange={handleChange}
                    required
                />
                <label htmlFor="nickname">닉네임</label>
                <input
                    className="blank"
                    type="text"
                    name="nickname"
                    id="nickname"
                    value={formData.nickname}
                    placeholder="닉네임"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">비밀번호</label>
                <div id="containImg">
                    <input
                        className="blank"
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <img src={lock} alt="lock" />
                </div>

                <label htmlFor="repeatedPassword">비밀번호 재확인</label>
                <div id="containImg">
                    <input
                        className="blank"
                        type="password"
                        name="repeatedPassword"
                        id="repeatedPassword"
                        value={formData.repeatedPassword}
                        onChange={handleChange}
                        required
                    />
                    <img src={beforeCheck} alt="beforeCheck" />
                </div>

                <label htmlFor="name">이름</label>
                <input
                    className="blank"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    placeholder="이름"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="dateSelect">생년월일</label>
                <div id="dateSelect">
                    <select id="year" value={year} onChange={handleYearChange} required>
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}년
                            </option>
                        ))}
                    </select>

                    <select id="month" value={month} onChange={handleMonthChange} required>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {m}월
                            </option>
                        ))}
                    </select>

                    <select id="date" value={date} onChange={handleDateChange} required>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                                {d}일
                            </option>
                        ))}
                    </select>
                </div>

                <label htmlFor="phoneNumber">휴대전화</label>
                <div className="certification">
                    <input className="blank" type="tel" name="phoneNumber" id="phoneNumber" autoComplete="tel"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange} required />
                    <input className="certi" type="button" value="인증번호" onClick={handleSendSms} />
                </div>
                <div className="certification">
                    <input className="blank" type="number" name="certificationNum"
                        placeholder="인증번호를 입력하세요" id="certiPhone"
                        value={certificationNum}
                        onChange={(e) => setCertificationNum(e.target.value)} required />
                    <input className="certi" type="button" value="확인" onClick={handleCertificationSubmit} />
                </div>
                <input className="submit" type="submit" value="가입하기" />
            </form>
        </div>
    );
}

export default Register;
