import jwt from 'jsonwebtoken';
import blackList from '../models/blackList.js';

export const verifyToken = async (req, res, next) => {
    const token = (req.body && req.body.token) || req.query.token || req.headers['authorization'];
    if (!token) {
        return res.status(400).json({ success: false, message: "Token required!" });
    }

    let token_value;
    if (token.startsWith('Bearer ')) {
        token_value = token.split(" ")[1];
    } else {
        token_value = token; // fallback if token is sent without "Bearer "
    }

    try {
        // let token_value = token.split(" ")[1];
        const black_listed_token = await blackList.findOne({ token: token_value });
        if (black_listed_token) {
            return res.status(401).json({ success: false, message: "Session has expired!" });
        }
        const decoded_token = jwt.verify(token_value, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded_token?.user;
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    return next();
}