import React, { useState } from 'react';
import './Style.css'; // CSS 파일을 import
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../img/semohan-logo.png';
import profileImg from '../img/profile-user.png';
import searchImage from '../img/search.png';
import ProfileSearchHeader from './ProfileSearchHeader';

function WriteReview() {
  const navigate = useNavigate();
  const { restaurantId } = useParams(); // URL 파라미터에서 restaurantId를 가져옴
  const [reviewContent, setReviewContent] = useState('');
  const [mealType, setMealType] = useState(1); // 기본값을 점심으로 설정
  const [likeRestaurant, setLikeRestaurant] = useState(false);
  const [likeMenu, setLikeMenu] = useState(false);

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

    axios.post(`/review/${restaurantId}/write`, reviewData, { withCredentials: true })
      .then(response => {
        if (response.data) {
          alert('리뷰가 등록되었습니다!');
          navigate(`/restaurant/detail/${restaurantId}`);
        } else {
          alert('리뷰 등록에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('리뷰 등록 중 오류 발생:', error);
        alert('리뷰 등록 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="body">
      <ProfileSearchHeader />
      <div className="review-container">
        <div className="date">
          <span>{todayDate}</span>
          <select value={mealType} onChange={handleMealTypeChange} className="dropdown">
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
        <div className="like-buttons">
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
          <button onClick={handleSubmit}>등록하기</button>
        </div>
      </div>
    </div>
  );
}

export default WriteReview;
