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

            if (restaurants.length === 0) {
                console.log("There isn't restaurant's info")
                return;
            } // 레스토랑이 없으면 스크랩 상태를 가져오지 않음

            try {
                const response = await axios.get('/restaurant/scrap-pin', { withCredentials: true });
                const scrapList = response.data.scrappedRestaurnats || [];

                // 받아온 데이터와 현재 레스토랑 리스트를 비교하여 스크랩 상태 업데이트
                // const updatedScrapStatus = restaurants.map(restaurant =>
                //     scrapList.some(scrap => scrap.id === restaurant.id)
                // );

                const updatedScrapStatus = {};
                scrapList.forEach(scrap => {
                    updatedScrapStatus[scrap.id] = true; // 스크랩된 상태는 true로 설정
                });

                setScrapStatus(updatedScrapStatus); // 스크랩 상태 설정
            } catch (error) {
                console.error("There was an error fetching scrap status!", error);

                // 오류 시 기본값 설정
                setScrapStatus(Array(restaurants.length).fill(false));
            }
        };

        fetchScrapStatus();
    }, [restaurants]); // 의존성 배열에 restaurants 추가

    // 스크랩 상태 업데이트 함수
    const updateScrapStatus = (restaurantId, isScrapped) => {
        // setScrapStatus(prevStatus =>
        //     prevStatus.map((status, index) => {
        //         if (restaurants[index].id === restaurantId) {
        //             return isScrapped;
        //
        //         }
        //         return prevStatus[index];
        //     })
        // );

        // setScrapStatus(prevStatus =>
        //     prevStatus.map((status, index) =>
        //         restaurants[index].id === restaurantId ? isScrapped : status
        //     )
        // );
        setScrapStatus(prevStatus => ({
            ...prevStatus,
            [restaurantId]: isScrapped,
        }));
    };

    return (
        <ScrapContext.Provider value={{ scrapStatus, setScrapStatus, updateScrapStatus, setRestaurants }}>
            {children}
        </ScrapContext.Provider>
    );
};

export default ScrapContext;
