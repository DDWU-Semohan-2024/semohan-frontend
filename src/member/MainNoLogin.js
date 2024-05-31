import React, {useEffect, useState} from 'react';
import "./Style.css"; // CSS 파일을 import
import { Link } from 'react-router-dom';
import logoImage from '../img/semohan-logo.png';
import noLoginImage from '../img/add.png';
import searchImage from '../img/search.png';
import addressImage from '../img/gps.png';
import example from '../img/buffetjpg.jpg';
import bookmarkImage from '../img/bookmark-white.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function MainNoLogin() {

    const [address, setAddress] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     axios.get("/location/set/", {
    //         withCredentials: true
    //     }).then(response => {
    //         setAddress(response.data);
    //     }).catch(error => {
    //         console.error("There was an error fetching the address data!", error);
    //     });
    // }, []);

    // if (!address) {
    //     return <div>Loading...</div>;
    // }


    return (
        <div id="body">
            <header>
                <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}
                        onClick={() => navigate('/login')}>
                    <img src={noLoginImage} alt="logo" style={{width: '50%'}}/>
                </button>

                <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                    <img src={logoImage} alt="login" style={{width: '90%'}}/>
                </button>

                <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                    <img src={searchImage} alt="search" style={{width: '45%'}}/>
                </button>
            </header>


            {/*(식당 개수 받아와서) 동적으로 띄울 수 있게 구현할 것*/}

            <div id="main_noLogin" style={{backgroundColor: "lemonchiffon", width: '100%'}}>
                {/* 첫 번째 줄 */}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '20%'}}>(위치) 인근 한식 뷔페</span>
                    <input className="setLocation" type="button" value="위치설정" style={{
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}/>
                    <img src={addressImage} alt="search" style={{width: '5%'}}/>
                </div>

                {/* 두 번째 줄 */}
                <div style={{marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{backgroundColor: "white", flex: 1, marginRight: '10px', marginLeft: '10px'}}>
                        {/* 첫 번째 블록의 내용 */}
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={example} alt="search" style={{width: '90%', height: '90%', alignSelf: 'center'}}/>
                        </button>
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={bookmarkImage} style={{width:"5%",marginLeft: '-30px',marginTop:'-100px',position: "absolute"}}/>
                        </button>
                        <span style={{marginTop: '50%', marginLeft: '0%'}}>뷔페1</span>
                    </div>
                    <div style={{backgroundColor: "white", flex: 1, marginRight: '10px', marginLeft: '10px'}}>
                        {/* 두 번째 블록의 내용 */}
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={example} alt="search" style={{width: '90%', height: '90%', alignSelf: 'center'}}/>
                        </button>
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={bookmarkImage}
                                 style={{width: "5%", marginLeft: '-30px', marginTop: '-100px', position: "absolute"}}/>
                        </button>
                        <span style={{marginTop: '50%', marginLeft: '0%'}}>뷔페2</span>
                    </div>
                </div>

                {/* 세 번째 줄 */}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{backgroundColor: "white", flex: 1, marginRight: '10px', marginLeft: '10px'}}>
                        {/* 첫 번째 블록의 내용 */}
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={example} alt="search" style={{width: '90%', height: '90%', alignSelf: 'center'}}/>
                        </button>
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={bookmarkImage}
                                 style={{width: "5%", marginLeft: '-30px', marginTop: '-100px', position: "absolute"}}/>
                        </button>
                        <span style={{marginTop: '50%', marginLeft: '0%'}}>뷔페3</span>
                    </div>
                    <div style={{backgroundColor: "white", flex: 1, marginRight: '10px', marginLeft: '10px'}}>
                        {/* 두 번째 블록의 내용 */}
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={example} alt="search" style={{width: '90%', height: '90%', alignSelf: 'center'}}/>
                        </button>
                        <button style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer'}}>
                            <img src={bookmarkImage}
                                 style={{width: "5%", marginLeft: '-30px', marginTop: '-100px', position: "absolute"}}/>
                        </button>
                        <span style={{marginTop: '50%', marginLeft: '0%'}}>뷔페4</span>
                    </div>
                </div>
            </div>


        </div>
    )

}

export default MainNoLogin;