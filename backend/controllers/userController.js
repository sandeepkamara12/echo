//Default Imports
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import randomString from 'randomstring';
import path from 'path';
import { fileURLToPath } from "url";

//Import Models
import User from '../models/userModel.js';
import ResetPassword from "../models/resetPasswordModel.js";
import BlackList from "../models/blackList.js";
import OTP from "../models/otp.js";

//Import helpers
import { deleteImage } from "../helpers/deleteImage.js";
import { sendMail } from '../helpers/mailer.js';
import { otpOneMinuteValidation } from '../helpers/otpValidate.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateAccessToken = async (userData) => {
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
}
const generateRefreshToken = async (userData) => {
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2hr' });
}

const generateRandomOTP = async () => {
    return Math.floor(1000 + Math.random() * 9999)
}

export const registerUserController = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required!",
            });
        }
        let hashedPassword = await bcrypt.hash(password, 10);

        let ifUserExist = await User.findOne({ $or: [{ email }, { mobile }] });
        if (ifUserExist) {
            return res.status(400).json({
                success: false,
                message: ifUserExist.email === email ? "Email already registered!" : "Mobile number already registered!"
            });
        }

        let newUser = new User({ name, email, mobile, is_verified: false, password: hashedPassword, image: `images/${req.file.filename}` });
        const userData = await newUser.save();

        //Send verification email
        const message = `<p>Hii, ${name}, Please <a href='http://localhost:4000/mail-verification?id=${newUser?._id}'>verify</a> your email</p>`;
        await sendMail(email, 'Email Verification', message);

        return res.status(201).json({
            success: true,
            message: "User register successfully!",
            user: userData
        })
    } catch (error) {
        console.log(error, 'hi baby');
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const verifyUserController = async (req, res) => {
    try {
        if (req.query.id === undefined) {
            return res.render('404');
        }
        const userData = await User.findOne({ _id: req.query.id });
        if (userData) {
            if (userData.is_verified) {
                return res.render('mail-verification', { message: "Your email already verified!" });
            }
            await User.findByIdAndUpdate({ _id: req.query.id }, { $set: { is_verified: true } });
            return res.render('mail-verification', { message: "Mail has been verified successfully!" });
        }
        else {
            return res.render('mail-verification', { message: "User not found!" });
        }
    } catch (error) {
        return res.render('404');
    }
}

export const sendMailVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        const ifUserExist = await User.findOne({ email });
        if (ifUserExist) {
            if (ifUserExist?.is_verified) {
                return res.status(400).json({ success: false, message: "Email is already verified" });
            }
            else {
                const message = `<p>Hii, ${ifUserExist?.name}, Please <a href='http://localhost:4000/mail-verification?id=${ifUserExist?._id}'>verify</a> your email</p>`;
                await sendMail(ifUserExist?.email, 'Email Verification', message);
                return res.status(300).json({ success: true, message: "Email sent" });
            }
        }
        else {
            return res.status(400).json({ success: false, message: "Email does not exists!" })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const ifUserExist = await User.findOne({ email });
        if (!ifUserExist) {
            return res.status(400).json({ success: false, message: "Email does not exists!" });
        }
        const random_string = randomString.generate();
        const message = `<p>Hii, ${ifUserExist?.name}, Please click <a href='http://localhost:4000/reset-password?token=${random_string}'>here </a> to reset the password</p>`;
        await ResetPassword.deleteMany({ user_id: ifUserExist?._id });
        const updatedPassword = new ResetPassword({
            user_id: ifUserExist?._id,
            token: random_string
        });
        await updatedPassword.save();
        await sendMail(ifUserExist?.email, 'Reset Password', message);

        return res.status(201).json({ success: true, message: "Reset Password email sent to your email id" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        if (req.query.token === 'undefined') {
            console.log('undefined');
            return res.render('404');
        }
        const resetData = await ResetPassword.findOne({ token: req.query.token });
        if (!resetData) {
            return res.render('404');
        }
        return res.render('reset-password', { resetData })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateForgotPasswordController = async (req, res) => {
    try {
        const { user_id, new_password, confirm_new_password } = req.body;
        const resetData = await ResetPassword.findOne({ user_id });
        if (new_password !== confirm_new_password) {
            return res.render('reset-password', { resetData, error: "Password does not match!" });
        }
        let newHashedPassword = await bcrypt.hash(confirm_new_password, 10);
        await User.findByIdAndUpdate({ _id: user_id }, {
            $set: {
                password: newHashedPassword
            }
        });
        await ResetPassword.deleteMany({ user_id });
        return res.render('success', { message: "Password updated successfully!" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
            return res.status(400).json({ success: false, message: "Email and password are incorrect" });
        }

        let isPasswrodMatch = await bcrypt.compare(password, isUserExist?.password);
        if (!isPasswrodMatch) {
            return res.status(400).json({ success: false, message: "Email and password are incorrect" });
        }

        if (!isUserExist?.is_verified) {
            return res.status(400).json({ success: false, message: "Please verify your account!" });
        }

        const access_token = await generateAccessToken({ user: isUserExist });
        const refresh_token = await generateRefreshToken({ user: isUserExist });
        return res.status(200).json({ success: true, message: "Login Successfully!", access_token, refresh_token, token_type: "Bearer" });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const userProfileController = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "Fetched current user information!", user: req.user });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const userUpdateProfileController = async (req, res) => {
    try {
        const { name, mobile } = req.body;
        let data = { name, mobile };

        if (req.file) { // safer check
            data.image = req.file.filename;

            const oldUser = await User.findById(req.user._id);
            if (oldUser && oldUser.image) {
                const oldFilePath = path.join(__dirname, `../public/images/${oldUser.image}`);
                await deleteImage(oldFilePath);
            }
        }

        await User.findByIdAndUpdate({ _id: req.user._id }, { $set: data }, { new: true });

        return res.status(200).json({ success: true, message: "User updated successfully!" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findOne({ _id: userId });
        const access_token = await generateAccessToken({ user });
        const refresh_token = await generateRefreshToken({ user });
        return res.status(200).json({ success: true, message: "Token Refreshed!", access_token, refresh_token });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const logoutController = async (req, res) => {
    try {
        const token = (req.body && req.body.token) || req.query.token || req.headers['authorization'];
        let token_value = token.split(" ")[1];
        let black_listed_token = new BlackList({ token: token_value });
        await black_listed_token.save();
        res.setHeader('Clear-Site-Data', '"cookies", "storage"');
        return res.status(200).json({ success: true, message: "You are logged out!" })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const sendOTPVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "Email does not exists!"
            });
        }

        if (userData.is_verified === true) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified!"
            });
        }

        const oldOTP = await OTP.findOne({ user_id: new mongoose.Types.ObjectId(userData._id) });

        if (oldOTP) {
            const sendNextOTP = await otpOneMinuteValidation(oldOTP.timestamps);
            if (!sendNextOTP) {
                return res.status(400).json({
                    success: false,
                    message: "Please try after a minute."
                });
            }
        }

        const generated_otp = await generateRandomOTP();
        const current_date = new Date();

        await OTP.findOneAndUpdate(
            { user_id: userData._id },
            {
                otp: generated_otp,
                timestamps: new Date(current_date.getTime())
            },
            {
                upsert: true,
                new: true,
                setDefaultOnInsert: true
            });

        const message = `<p>Hii, ${userData?.name}, Please fill your otp to verify your email. ${generated_otp}</p>`;
        await sendMail(userData?.email, 'Email Verification', message);

        return res.status(200).json({ success: true, message: "OTP sent to your email successfully!" })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const otpVerificationController = async (req, res) => {
    try {
        const { user_id, otp } = req.body;

        // Check, is user exist?
        const userData = await User.findOne({ _id:user_id });
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "User does not exists!"
            });
        }

        // Check, is otp valid or not?
        const otpData = await OTP.findOne({ user_id, otp });
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "You entered wrong OTP!"
            });
        }


        // Check, is account already verified or not
        if (userData.is_verified === true) {
            return res.status(400).json({
                success: false,
                message: "Account is already verified!"
            });
        }

        const generated_otp = await otpOneMinuteValidation(otpData?.timestamps);
        console.log(generated_otp, 'hello dear');
        if (generated_otp) {
            return res.status(400).json({
                success: false,
                message: "Your OTP has been expired!"
            });
        }

        await User.findByIdAndUpdate(
            { _id: user_id },
            {
                $set:{is_verified:true},
            });

        return res.status(200).json({ success: true, message: "Account verified successfully!" })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}