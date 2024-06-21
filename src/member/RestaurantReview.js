import React, { useState, useEffect } from 'react';
import './Style.css'; // CSS 파일을 import
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../img/semohan-logo.png';
import noLoginImage from '../img/add.png';
import profileImg from '../img/profile-user.png';
import searchImage from '../img/search.png';
import ProfileSearchHeader from './ProfileSearchHeader';

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
  const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부 상태
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 로그인 상태 확인 API 호출
    axios.get('/member/info', { withCredentials: true })
      .then(response => {
        // 응답 데이터가 존재하면 로그인 상태로 간주
        if (response.data && response.data.username) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('로그인 상태 확인 중 오류 발생:', error);
        setLoggedIn(false);
      });

    // 레스토랑 리뷰 데이터 가져오기
    axios.get(`/restaurant/${restaurantId}`, { withCredentials: true })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
      });
  }, [restaurantId]);

  return (
    <div id="body">
        <ProfileSearchHeader />
      <div id="caption">리뷰 {reviews.length}개</div>
      <div className="reviews">
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
  );
}

export default RestaurantReview;
