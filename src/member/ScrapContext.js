import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// ScrapContext 생성
const ScrapContext = createContext();

// ScrapProvider 생성: 전역 상태를 제공하는 컴포넌트
export const ScrapProvider = ({ children }) => {
    const [scrapStatus, setScrapStatus] = useState([]); // 스크랩 상태
    const [restaurants, setRestaurants] = useState([]); // 레스토랑 리스트

    // 스크랩 상태를 서버에서 가져오는 함수
    useEffect(() => {
        const fetchScrapStatus = async () => {
            try {
                const response = await axios.get('/restaurant/scrap-pin', { withCredentials: true });
                const scrapList = response.data.scrappedRestaurants || [];

                // 받아온 데이터와 현재 레스토랑 리스트를 비교하여 스크랩 상태 업데이트
                const updatedScrapStatus = restaurants.map(restaurant =>
                    scrapList.some(scrap => scrap.id === restaurant.id)
                );

                setScrapStatus(updatedScrapStatus); // 스크랩 상태 설정
            } catch (error) {
                console.error("There was an error fetching scrap status!", error);
            }
        };

        fetchScrapStatus();
    }, [restaurants]);

    // 스크랩 상태 업데이트 함수
    const updateScrapStatus = (restaurantId, isScrapped) => {
        setScrapStatus(prevStatus =>
            prevStatus.map((status, index) => {
                if (restaurants[index].id === restaurantId) {
                    return isScrapped;

                }
                return prevStatus[index];
            })
        );
    };

    return (
        <ScrapContext.Provider value={{ scrapStatus, updateScrapStatus, setRestaurants }}>
            {children}
        </ScrapContext.Provider>
    );
};

export default ScrapContext;
