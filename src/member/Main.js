import React, {useEffect, useState} from 'react';
import "./Style.css"; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import noLoginImage from '../img/add.png';
import searchImage from '../img/search.png';
import addressImage from '../img/gps.png';
import example from '../img/buffetjpg.jpg';
import noScrap from '../img/bookmark-white.png';
import scrap from '../img/bookmark-black.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import profileImg from "../img/profile-user.png";

function Main() {
    const [address, setAddress] = useState(null);
    const [restaurants, setRestaurants] = useState([]);

    const navigate = useNavigate();
    const [scrapImages, setScrapImages] = useState([noScrap, noScrap]); // 각 핀의 스크랩 이미지를 배열로 관리

    const handleScrap = (index) => {
        setScrapImages(prevImages =>
            prevImages.map((img, i) => (i === index ? (img === noScrap ? scrap : noScrap) : img))
        );
    }

    const handleLocationSetting = () => {
        // 위치 설정 로직
        navigator.geolocation.getCurrentPosition(alterAddress, doSomethingError);
        console.log('위치 설정 버튼 클릭됨');
    };


    const alterAddress = (position) => {

        let x = 127.04742793253544 ; //position.coords.longitude; //테스트를 위해 성북구로 지정
        let y = 37.60422583406296; //position.coords.latitude; //테스트를 위해 성북구로 지정
        if (x && y) {
            axios.get(
                `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
                { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}` } }
            ).then((result) => {
                // 행정구역의 구 부분만 가져옵니다
                let location = result.data.documents[0].address.region_2depth_name;
                console.log("location: " + location);
                setAddress(location);
                axios.get(`/location/set/${encodeURIComponent(location)}`, {
                    // withCredentials: true
                }).then(() => {
                    fetchRestaurants(); // Fetch restaurants after setting address
                }).catch(error => {
                    console.error("There was an error setting the location!", error);
                });
            }).catch(error => {
                console.error("There was an error fetching the address data!", error);
            });
        }
    };

    const doSomethingError = (error) => {
        console.log('location error', error);
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(alterAddress, doSomethingError);
    }, []);
    // useEffect(() => {
    //     axios.get("/location/set/", {
    //         withCredentials: true
    //     }).then(response => {
    //         setAddress(response.data);
    //     }).catch(error => {
    //         console.error("There was an error fetching the address data!", error);
    //     });
    // }, []);

    const fetchRestaurants = () => {
        axios.get(`/restaurant/nearby`, {
            //withCredentials: true
        }).then((response) => {
            setRestaurants(response.data);
        }).catch((error) => {
            console.error("There was an error fetching the restaurant data!", error);
        });
    };

    if (!restaurants) {
        return <div>Loading...</div>;
    }

    return (
        <div id="newBody">
            <header id="newHeader">
                <img className="headerImg" src={noLoginImage} onClick={() => navigate('/register')} alt="profile"/>
                {/*로그인 했을 경우/!*<img className="headerImg" src={profileImg} onClick={() => navigate('/myPage')} alt="profile"/>*!/*/}
                <img src={logoImage} alt="logo"/>
                <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search"/>
            </header>

            {/*Pin이 없을 경우*/}
            <div className="pin">
                단골 식당을 <span>PIN</span> 해주세요
            </div>

            {/*Pin 있을 경우*/}
            <div id="menu">
                <div>
                    식당 이름 - 점심{/*{restaurant.name} - {restaurant.mealType}*/}
                </div>
                <span></span>
                <div className='title'>
                    메인 메뉴
                </div>
                {/*메인 개수 따라서 늘어남*/}
                <div className='menuName'>
                    고등어조림{/*{restaurant.mainMenu}*/}
                </div>
                <div className='title'>
                    반찬
                </div>
                {/*반찬 개수 따라서 늘어남*/}
                <div className='menuName'>
                    계란말이{/*{restaurant.subMenu}*/}
                </div>
                <div className='menuName'>
                    계란말이{/*{restaurant.subMenu}*/}
                </div>
                <div className='menuName'>
                    계란말이{/*{restaurant.subMenu}*/}
                </div>
                <div className='menuName'>
                    계란말이{/*{restaurant.subMenu}*/}
                </div>

            </div>

            {/*로그인 안했을 경우 + 기본*/}
            <div id="main_noLogin">
                <div className="loc">
                    <p><span>{address}</span> 인근 한식 뷔페</p>
                    {/*위치권한 물어보기*/}
                    <button className="setLoc" onClick={handleLocationSetting}>
                        <div className="locationText">위치 설정</div>
                        <img className="locImg" src={addressImage} alt="search"/>
                    </button>
                </div>

                <div className="image-grid">
                    {/*식당 수만큼*/}
                    {scrapImages.map((img, index) => (
                        <div className="image-container" key={index}>
                            <img className="resImg" src={example/*식당사진*/} alt="search"/>
                            <img
                                className="bookmark-image"
                                src={img}
                                onClick={() => handleScrap(index)}
                                alt="bookmark"
                            />
                            <span className="image-caption" onClick={() => navigate('/detailRestaurant')}>뷔페{index + 1}</span>
                        </div>
                    ))}

                    {restaurants.map((restaurant, index) => (
                        <div className="image-container" key={index}>
                            <img className="resImg" src={restaurant.s3Url} alt="search"/>
                            <img className="bookmark-image" src={scrapImages} onClick={() => {/* 클릭마다 사진 바뀜, 스크랩 등록+취소 */}}/>
                            <span className="image-caption">{restaurant.name}</span>
                        </div>
                    ))}
                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}
                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}

                    {/*<div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div><div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div><div className="image-container">*/}
                    {/*    <img className="resImg" src={example/*식당사진*!/ alt="search"/>*/}
                    {/*    <img className="bookmark-image" src={bookmarkImage} onClick={/!*클릭마다 사진 바뀜, 스크랩 등록+취소*!/}/>*/}
                    {/*    <span className="image-caption">뷔페1</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )

}

export default Main;