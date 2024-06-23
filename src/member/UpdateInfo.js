import React, { useEffect, useState } from 'react';
import './Style.css';
import logoImage from '../img/semohan-logo.png';
import lock from "../img/lock.png";
import beforeCheck from "../img/free-icon-checkmark-656971.png";

import {Link, useLocation, useNavigate} from 'react-router-dom';

import { useLocation, useNavigate } from 'react-router-dom';
import LogoHeader from './LogoHeader';


function UpdateInfo() {
    const [year, setYear] = useState(2000); // 기본 연도를 2000년으로 설정
    const [month, setMonth] = useState(1); // 기본 월을 1월로 설정
    const [date, setDate] = useState(1); // 기본 일을 1일로 설정
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nickname: '',
        phoneNumber: '',
        password: '',
        birthday: ''
    });

    const [existingData, setExistingData] = useState({
        nickname: '',
        phoneNumber: '',
        birthday: ''
    });

    const [passwordCheck, setPasswordCheck] = useState('');

    useEffect(() => {
        // 기존 회원 정보 불러오기
        fetch('member/info', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || '네트워크 응답이 정상이 아닙니다');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setFormData({
                    nickname: data.nickname || '',
                    phoneNumber: data.phoneNumber || '',
                    password: '',
                    birthday: data.birthday || ''
                });
                setExistingData({
                    nickname: data.nickname || '',
                    phoneNumber: data.phoneNumber || '',
                    birthday: data.birthday || ''
                });
                // 년, 월, 일을 각각 설정
                if (data.birthday) {
                    const [birthYear, birthMonth, birthDate] = data.birthday.split('-');
                    setYear(parseInt(birthYear, 10));
                    setMonth(parseInt(birthMonth, 10));
                    setDate(parseInt(birthDate, 10));
                }
            }
        })
        .catch(error => {
            console.error('Error fetching member info:', error);
            setError(error.message);
            alert(error.message);  // 오류 메시지를 팝업으로 띄우기
        });

        if (location.state && location.state.user) {
            const { nickname, phoneNumber, birthday } = location.state.user;
            setFormData({
                nickname: nickname || '',
                phoneNumber: phoneNumber || '',
                password: '',
                birthday: birthday || ''
            });
            setExistingData({
                nickname: nickname || '',
                phoneNumber: phoneNumber || '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'passwordCheck') {
            setPasswordCheck(value);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        if (formData.phoneNumber.length === 11) {
            setFormData((prevData) => ({
                ...prevData,
                phoneNumber: formData.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
            }));
        } else if (formData.phoneNumber.length === 13) {
            setFormData((prevData) => ({
                ...prevData,
                phoneNumber: formData.phoneNumber
                    .replace(/-/g, '')
                    .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
            }));
        }
    }, [formData.phoneNumber]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.password || !passwordCheck) {
            alert('비밀번호와 비밀번호 재확인을 입력하세요.');
            return;
        }
        if (formData.password !== passwordCheck) {
            alert('비밀번호와 비밀번호 재확인이 일치하지 않습니다.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert('비밀번호는 영문자와 숫자를 포함하여 8자리 이상이어야 합니다.');
            return;
        }

        const updatedData = {
            password: formData.password,
            repeatedPassword: passwordCheck,
            nickname: formData.nickname || existingData.nickname,
            phoneNumber: formData.phoneNumber || existingData.phoneNumber,
            birthday: formData.birthday || existingData.birthday
        };

        fetch('member/edit-info', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || '네트워크 응답이 정상이 아닙니다');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log('Update successful:', data);
                navigate('/myInfo');
            } else {
                alert('회원정보 수정에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error updating member info:', error);
            alert(error.message);  // 오류 메시지를 팝업으로 띄우기
        });
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => 1940 + i);

    return (
        <div id="body">

            <header>
                <Link to="/main"><img src={logoImage} alt="logo"/></Link>
            </header>

            <LogoHeader/>

            <form id="updateInfo" method="post" action="" onSubmit={handleSubmit}>
                <label htmlFor="nickname">닉네임</label>
                <input
                    className="blank"
                    type="text"
                    name="nickname"
                    id="nickname"
                    value={formData.nickname}
                    placeholder="닉네임"
                    onChange={handleChange}
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
                    <img src={lock} alt="lock"/>
                </div>

                <label htmlFor="passwordCheck">비밀번호 재확인</label>
                <div id="containImg">
                    <input
                        className="blank"
                        type="password"
                        name="passwordCheck"
                        id="passwordCheck"
                        value={passwordCheck}
                        onChange={handleChange}
                        required
                    />
                    <img src={beforeCheck} alt="beforeCheck"/>
                </div>

                <label htmlFor="dateSelect">생년월일</label>
                <div id="dateSelect">
                    <select id="year" value={year} onChange={handleYearChange}>
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}년
                            </option>
                        ))}
                    </select>

                    <select id="month" value={month} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {m}월
                            </option>
                        ))}
                    </select>

                    <select id="date" value={date} onChange={handleDateChange}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                                {d}일
                            </option>
                        ))}
                    </select>
                </div>
                <label htmlFor="phoneNumber">휴대전화</label>
                <input
                    className="blank"
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    placeholder="휴대전화"
                    onChange={handleChange}
                />

                <input className="submit" type="submit" value="저장"/>
            </form>
        </div>
    );
}

export default UpdateInfo;
