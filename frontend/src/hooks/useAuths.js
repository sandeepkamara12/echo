import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

export const useAuth = () => {
    const [token, setToken] = useLocalStorage('token', null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`${import.meta.env.VITE_BA_URL}/auth/me`);
                if (response?.status===200) {
                    let loginUser = {
                        email:response?.data?.email,
                        firstName:response?.data?.firstName,
                        lastName:response?.data?.lastName,
                        image:response?.data?.image,
                        username:response?.data?.username,
                    }
                    setUser(loginUser);
                }
            } catch (error) {
                console.log(error.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchUser()
    }, [token]);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BA_URL}/auth/login`, {
                username: email,
                password: password,
                expiresInMins: 30,
            });
            if(response?.status === 200) {
                let loginUser = {
                    email:response?.data?.email,
                    firstName:response?.data?.firstName,
                    lastName:response?.data?.lastName,
                    image:response?.data?.image,
                    username:response?.data?.username,
                }
                setToken(response?.data?.accessToken);
                setUser(loginUser);
                navigate('/users')
            }
        } catch (error) {
            console.log(error.message, 'error');
            setToken(null);
        }
        finally {
            setLoading(false);
        }
    }, [navigate, setToken]);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate, setToken]);
    
    return { user, token, loading, login, logout, isAuthenticated: !!token };
}