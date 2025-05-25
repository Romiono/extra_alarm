import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/AuthContext'

const api = axios.create({
    baseURL: process.env.BASE_URL // замени на свой API
    // timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.Authorization = "'Content-Type': 'application/json'";
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log(error);
        if (error.response?.status === 403 || error.response?.status === 401) {
            const {clearToken} = useAuth()
            await clearToken()
        }
        return Promise.reject(error);
    }
);

export default api;
