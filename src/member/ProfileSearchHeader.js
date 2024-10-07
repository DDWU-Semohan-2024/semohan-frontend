import React, { useCallback, useEffect, useState } from 'react';
import "./Style.css"; // CSS 파일을 import
import logoImage from '../img/semohan-logo.png';
import noLoginImage from '../img/login.png'; //
import searchImage from '../img/search.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import profileImg from "../img/profile-user.png";

const ProfileSearchHeader = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    const checkLoginStatus = useCallback(() => {
        axios.get('/member/info', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setLoggedIn(true);
                } else {
                    setLoggedIn(false);
                }
            }).catch(error => {
            console.error("There was an error checking login status!", error);
        });
    }, []);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    return (
        <header id="newHeader">
            {!loggedIn ? (
                <img className="headerImg" src={noLoginImage} onClick={() => navigate('/login')} alt="profile" />
            ) : (
                <img className="headerImg" src={profileImg} onClick={() => navigate('/myPage')} alt="profile" />
            )}
            <img src={logoImage} alt="logo" onClick={() => navigate('/main')} />
            <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search" />
        </header>
    );
};

export default ProfileSearchHeader;
