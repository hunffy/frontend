import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthToken from './useAuthToken';
import instance from '../utils/api/instance';

export const useGetUserInfo = () => {
    const token = useAuthToken();

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ email: '', nickname: '', img: '' });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        } else {
            const fetchUserInfo = async () => {
                try {
                    const response = await instance.get('/users');
                    console.log('마이페이지 유저정보', response);
                    const { email, nickname } = response.data.data;
                    setUserInfo({
                        email: email,
                        nickname: nickname,
                        img: 'https://thumb.ac-illust.com/73/7387030e5a5600726e5309496353969a_t.jpeg',
                    });
                } catch (error) {
                    console.error('유저정보를 불러오는 데 실패했습니다', error);
                }
            };
            fetchUserInfo();
        }
    }, [token, navigate]);

    return {
        userInfo,
        setUserInfo,
    };
};
