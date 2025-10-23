import axios from "axios";

export const registerUser = async userData => {
    console.log('hi');
    try {
        const response = await axios.post(`${import.meta.env.VITE_BA_URL}/api/register`, userData)
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
export const forgotPassword = async (userEmail) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BA_URL}/api/forgot-password`, userEmail);
        console.log(response, 'res');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}