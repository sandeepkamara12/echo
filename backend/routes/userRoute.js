import express from "express";
import { forgotPasswordController, getAllOtherUsers, loginUserController, logoutController, otpVerificationController, refreshTokenController, registerUserController, sendMailVerificationController, sendOTPVerificationController, userProfileController, userUpdateProfileController } from "../controllers/userController.js";
import { uploadSingleFile, uploadSingleImage } from "../middlewares/uploadMiddleware.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { OTPVerificationValidator, ResetPasswordVerification, loginUserValidation, registerUserValidation, sendMailVerification, updateUserProfileValidation } from "../helpers/validations.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/register", uploadSingleImage('image'),  registerUserValidation, validationMiddleware, registerUserController);
userRouter.post("/send-verification-email", sendMailVerification, validationMiddleware, sendMailVerificationController);
userRouter.post("/send-verification-otp", sendMailVerification, validationMiddleware, sendOTPVerificationController);
userRouter.post("/verification-otp", OTPVerificationValidator, validationMiddleware, otpVerificationController);
userRouter.post("/forgot-password", ResetPasswordVerification, validationMiddleware, forgotPasswordController);
userRouter.post("/login", loginUserValidation, validationMiddleware, loginUserController);
userRouter.post("/profile", verifyToken, userProfileController);
userRouter.get("/get-all-other-users", verifyToken, getAllOtherUsers);
userRouter.post("/update-profile", verifyToken, uploadSingleImage('image'), updateUserProfileValidation, validationMiddleware,  userUpdateProfileController);


userRouter.post("/upload", verifyToken, uploadSingleFile('image'), (req, res) => {
  return res.status(200).json({ url: `http://localhost:4000/images/${req.file.filename}` });
});


userRouter.get("/refresh-token", verifyToken,  refreshTokenController);
userRouter.get("/logout", verifyToken,  logoutController);



export default userRouter;