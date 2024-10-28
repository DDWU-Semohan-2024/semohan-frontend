import React, { useState } from 'react';
import './Style.css'; // CSS 파일을 import
import {Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import ProfileSearchHeader from './ProfileSearchHeader';

import profileImg from '../img/profile-user.png'
import searchImage from '../img/search.png'
import logoImage from '../img/semohan-logo.png';

function WriteReview() {
  const navigate = useNavigate();
  const { restaurantId } = useParams(); // URL 파라미터에서 restaurantId를 가져옴
  const [reviewContent, setReviewContent] = useState('');
  const [mealType, setMealType] = useState(1); // 기본값을 점심으로 설정
  const [likeRestaurant, setLikeRestaurant] = useState(false);
  const [likeMenu, setLikeMenu] = useState(false);
  const [error, setError] = useState('');

  const todayDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const handleContentChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleMealTypeChange = (e) => {
    setMealType(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    const reviewData = {
      content: reviewContent,
      mealType,
      likeRestaurant,
      likeMenu,
    };

    axios.post(`/review/write/${restaurantId}`, reviewData, { withCredentials: true })
      .then(response => {
        if (response.data) {
          alert('리뷰가 등록되었습니다!');
          navigate(`/restaurantReview/${restaurantId}`);
        } else {
          alert('리뷰 등록에 실패했습니다.');
        }
      })
      .catch(error => {
        setError(error.response.data.message); // 백엔드에서 온 오류 메시지 설정
        console.error(error.response.data.message, error);
        alert(error.response.data.message);  // 오류 메시지를 팝업으로 띄우기
      });
  };

  return (
    <div id="newBody">
      <div className="no-mobile">모바일 버전으로 변경해주세요.</div>
      <div className="mobile">
        <ProfileSearchHeader />

        <div id="review-container">
          <div className="date">
            <span>{todayDate}</span>
            <select id="drop-down" value={mealType} onChange={handleMealTypeChange} className="dropdown">
              <option value={0}>올데이</option>
              <option value={1}>점심</option>
              <option value={2}>저녁</option>
            </select>
          </div>
          <div className="review-content">
            <textarea
              placeholder="리뷰 내용"
              value={reviewContent}
              onChange={handleContentChange}
            ></textarea>
          </div>
          <div id="like-buttons">
            <label>
              <input
                type="checkbox"
                checked={likeRestaurant}
                onChange={() => setLikeRestaurant(!likeRestaurant)}
              />
              식당 좋아요
            </label>
            <label>
              <input
                type="checkbox"
                checked={likeMenu}
                onChange={() => setLikeMenu(!likeMenu)}
              />
              메뉴 좋아요
            </label>
          </div>
          <div className="submit-button">
            <button className="lemon" onClick={handleSubmit}>등록하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteReview;
