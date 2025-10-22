import axiosInstance from '../axiosInstance';
export const getAllUsers = async ({signal}) => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BA_URL}/users`);
        if(response?.success) {
            return response?.users
        }
    } catch (error) {
        return error.message;
    }
}