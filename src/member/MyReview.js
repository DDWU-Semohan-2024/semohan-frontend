import React, { useState, useEffect } from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import logoImage from '../img/semohan-logo.png';
import LogoHeader from './LogoHeader';

import profileImg from '../img/profile-user.png'
import searchImage from '../img/search.png'
import ProfileSearchHeader from "./ProfileSearchHeader";


const Review = ({ id, nickname, likeRestaurant, likeMenu, content, writeTime, onDelete }) => (
  <div className="review">
    <div className="review-header">
      <span className="nickname">{nickname}</span>
      <span className="write-time">{writeTime}</span>
      {likeRestaurant && <span className="restaurant">식당👍</span>}
      {likeMenu && <span className="menu">오늘 메뉴👍</span>}
    </div>
    <div className="content">{content}</div>
    <div className="delete" onClick={() => onDelete(id)}>삭제</div>
  </div>
);

function MyReview() {
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/review/my-reviews', { withCredentials: true })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('삭제하시겠습니까?')) {
      axios.delete(`/review/${id}`, { withCredentials: true })
        .then(response => {
          if (response.data) {
            setReviews(reviews.filter(review => review.id !== id));
          } else {
            alert('리뷰 삭제에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error('리뷰 삭제 중 오류 발생:', error);
          alert('리뷰 삭제 중 오류가 발생했습니다.');
        });
    }
  };

    return (
    <div id="newBody">

        <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
        <div className="mobile">
            <ProfileSearchHeader />

            {/*<header>*/}
            {/*<img className="headerImg" src={profileImg} onClick={() => navigate('/myPage')} alt="profile" />*/}
            {/*  <Link to="/main"><img src={logoImage} alt="logo"/></Link>*/}
            {/*<img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search" />*/}
            {/*</header>*/}

            {/*<LogoHeader/>*/}


          <div id="caption">리뷰 {reviews.length}개</div>
          <div className="myreview">
            {reviews.map((review) => (
              <Review
                key={review.id}
                id={review.id}
                nickname={review.nickname}
                likeRestaurant={review.likeRestaurant}
                likeMenu={review.likeMenu}
                content={review.content}
                writeTime={new Date(review.writeTime).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
    </div>
  );
}

export default MyReview;
