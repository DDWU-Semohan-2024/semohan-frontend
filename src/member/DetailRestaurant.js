import React from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import ProfileImage from "../img/profile-user.png";
import searchImage from "../img/search.png";

function DetailRestaurant() {

    const navigate = useNavigate();
    return (
        <div id="body">
            <header id="newHeader">
                <img className="headerImg" src={ProfileImage} onClick={() => navigate('/login')} alt="profile"/>
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>
            <section>
                <div>

                </div>
                <div>
                    <button>

                    </button>
                    <article>

                    </article>
                </div>
            </section>
            <section>

            </section>
        </div>
    );
}

export default DetailRestaurant;
