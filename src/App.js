import './App.css';
import React, { Component } from "react";
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FindId from "./member/FindId";
import ResultId from "./member/ResultId";
import MyPage from "./member/MyPage";
import MyInfo from "./member/MyInfo";
import Search from "./member/Search";
import DetailRestaurant from "./member/DetailRestaurant";
import ResultSearch from "./member/ResultSearch";
import ScrapRestaurant from "./member/ScrapRestaurant";
import GeneratePassword from "./member/GeneratePassword";
import Login from './member/Login';
import Main from './member/Main';
import UpdateInfo from './member/UpdateInfo';
import NewPassword from './member/NewPassword';
import Register from './member/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import ComingSoon from "./member/ComingSoon";

class App extends Component {
  render() {
    return (
        <Router>
          <Routes>

            <Route exact path="/findId" element={<FindId />} />
            <Route exact path="/resultId" element={<ResultId />} />
            <Route exact path="/myPage" element={<MyPage />} />
            <Route exact path="/myInfo" element={<MyInfo />} />
            <Route exact path="/search" element={<Search />} />
            <Route exact path="/detailRestaurant/:restaurantId" element={<DetailRestaurant />} />
            <Route exact path="/resultSearch" element={<ResultSearch />} />

            <Route exact path="/scrapRestaurant" element={<ScrapRestaurant />} />
            <Route exact path="/generatePassword" element={<GeneratePassword />} />

            <Route exact path="/login" element={<Login />} />
            <Route exact path="/main" element={<Main />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/newPassword" element={<NewPassword />} />
            <Route exact path="/updateInfo" element={<UpdateInfo />} />
            <Route exact path="/comingSoon" element={<ComingSoon />} />

            {/*<Route path="/" element={<Login />} /> /!* 기본적으로 /login으로 이동 *!/*/}
          </Routes>
        </Router>
    );
  }
}


export default App;
