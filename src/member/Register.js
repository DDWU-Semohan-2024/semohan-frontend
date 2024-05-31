import React, {useEffect, useState} from 'react';
import './Style.css';
import logoImage from '../img/semohan-logo.png';
import lock from "../img/lock.png"
import beforeCheck from "../img/free-icon-checkmark-656971.png"
import { useLocation } from 'react-router-dom';

function Register() {

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [date, setDate] = useState(new Date().getDate());

    const [phoneNum, setPhoneNum] = useState('');
    const [certificationNum, setCertificationNum] = useState('');

    const location = useLocation();

    const [formData, setFormData] = useState({
        username:'',
        nickname: '',
        name: '',
        phoneNum: '',
        password: '',
        birth: ''
    });

    const [passwordCheck, setPasswordCheck] = useState('');

    useEffect(() => {
        if (location.state && location.state.user) {
            const { username, nickname, name, phoneNum, password, birth } = location.state.user;
            setFormData({
                username: username || '',
                nickname: nickname || '',
                name: name || '',
                phoneNum: phoneNum || '',
                password: password || '',
                birth: birth || ''
            });
        }
    }, [location.state]);

    const updateBirth = (newYear, newMonth, newDate) => {
        setFormData((prevData) => ({
            ...prevData,
            birth: `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDate).padStart(2, '0')}`
        }));
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setYear(newYear);
        updateBirth(newYear, month, date);
    };

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        updateBirth(year, newMonth, date);
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        updateBirth(year, month, newDate);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== passwordCheck) {
            alert('비밀번호를 다시 확인하세요');
            return;
        }
        // Handle form submission logic here
        console.log(formData);
        console.log(passwordCheck);
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => 1940 + i);

    return (
        <div id="body">
            <header>
                <img src={logoImage} alt="logo" />
            </header>

            <form id="updateInfo" method="post" action="" onSubmit={handleSubmit}>

                <label htmlFor="nickname">아이디</label>
                <input
                    className="blank"
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    placeholder="아이디"
                    onChange={handleChange}
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
                    />
                    <img src={beforeCheck} alt="beforeCheck"/>
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
                />

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
                        {Array.from({length: 12}, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {m}월
                            </option>
                        ))}
                    </select>

                    <select id="date" value={date} onChange={handleDateChange}>
                        {Array.from({length: 31}, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                                {d}일
                            </option>
                        ))}
                    </select>
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
                <input className="submit" type="submit" value="가입하기"/>
            </form>
        </div>
    );
}

export default Register;