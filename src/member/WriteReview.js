import React, { useState } from 'react';
import './Style.css'; // CSS 파일을 import
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../img/semohan-logo.png';
import profileImg from '../img/profile-user.png';
import searchImage from '../img/search.png';

function WriteReview() {
  const navigate = useNavigate();
  const { restaurantId, menuId } = useParams();
  const [reviewContent, setReviewContent] = useState('');
  const [likeRestaurant, setLikeRestaurant] = useState(false);
  const [likeMenu, setLikeMenu] = useState(false);
  const todayDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`review/${restaurantId}/${menuId}/write`, {
        content: reviewContent,
        likeRestaurant,
        likeMenu
      }, { withCredentials: true });

      if (response.data) {
        alert('리뷰가 등록되었습니다!');
        navigate('restaurant/detail/{restaurantId}'); // 등록 후 이동할 경로
      } else {
        alert('리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 등록 중 오류 발생:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="body">
      <header>
        <img className="headerImg" src={profileImg} onClick={() => navigate('/myPage')} alt="profile" />
        <img className="logoImg" src={logoImage} alt="logo" />
        <img className="headerImg" src={searchImage} onClick={() => navigate('/search')} alt="search" />
      </header>
      <div className="container">
        <div className="date">
          <span>{todayDate}</span>
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
        <div className="review-content">
          <textarea
            placeholder="리뷰 내용"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          ></textarea>
        </div>
        <div className="submit-button">
          <button onClick={handleSubmit}>등록하기</button>
        </div>
      </div>
    </div>
  );
}

export default WriteReview;
