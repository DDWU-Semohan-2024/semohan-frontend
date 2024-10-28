import React, { useState, useEffect } from 'react';
import './Style.css'; // CSS 파일을 import

import {Link, useNavigate, useParams} from 'react-router-dom';

import { useLocation } from 'react-router-dom';

import axios from 'axios';
import logoImage from '../img/semohan-logo.png';
import ProfileSearchHeader from './ProfileSearchHeader';
// import { useNavigate } from 'react-router-dom'; // useNavigate 추가


const Review = ({ nickname, likeRestaurant, likeMenu, content, writeTime }) => (
  <div className="review">
    <div className="review-header">
      <span className="nickname">{nickname}</span>
      <span className="write-time">{writeTime}</span>
      {likeRestaurant && <span className="restaurant">식당👍</span>}
      {likeMenu && <span className="menu">오늘 메뉴👍</span>}
    </div>
    <div className="content">{content}</div>
  </div>
);

function RestaurantReview() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const { restaurantDetails } = location.state || {};
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

    const handleWriteReview = () => {
    navigate(`/writeReview/${restaurantId}`); // 페이지 이동 함수
  };

  useEffect(() => {
    // 레스토랑 리뷰 데이터 가져오기
    axios.get(`/review/restaurant/${restaurantId}`, { withCredentials: true })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
      });
  }, [restaurantId]);

  return (
    <div id="newBody">
        <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
        <div className="mobile">
           <ProfileSearchHeader />

          <div id="caption">리뷰 {reviews.length}개
            <button onClick={handleWriteReview} className="write-review-button-inline">리뷰 쓰기</button>
          </div>

            <div  className="reviews">
                <div className="review1">
                    {reviews.map((review) => (
                        <Review
                            key={review.id}
                            nickname={review.nickname}
                            likeRestaurant={review.likeRestaurant}
                            likeMenu={review.likeMenu}
                            content={review.content}
                            writeTime={new Date(review.writeTime).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}
                        />
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
}

export default RestaurantReview;
