import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export const useAuth = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useLocalStorage('access_token', null);
    const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    
    const login = async (userCredentials) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BA_URL}/api/login`, userCredentials);
            setAccessToken(response?.data?.access_token);
            setRefreshToken(response?.data?.refresh_token);
            return response.data;
        } catch (error) {
            setAccessToken(null);
            setRefreshToken(null);
            return error.response.data;
        }
        finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        navigate("/login");
    }

    useEffect(() => {
        const controller = new AbortController();
        const userProfile = async () => {
            try {
                const response = await axiosInstance.post(`${import.meta.env.VITE_BA_URL}/api/profile`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${accessToken}`
                    },
                    signal: controller.signal
                });
                setUser(response.data.user)
                return response.data;
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("🔕 Request canceled:", error.message);
                } else {
                    console.log(error, 'error getting profile data.');
                }
            }
        }
        if (accessToken) {
            userProfile();
        }
        return () => {
            controller.abort();
        };
    }, [accessToken]);

    return { loading, accessToken, refreshToken, user, login, logout, isAuthenticated: !!accessToken };
}