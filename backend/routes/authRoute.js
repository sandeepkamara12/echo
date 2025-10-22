import express from "express";
import {resetPasswordController, updateForgotPasswordController, verifyUserController} from '../controllers/userController.js';
const authRouter = express.Router();

authRouter.get("/mail-verification", verifyUserController);
authRouter.get("/reset-password", resetPasswordController);
authRouter.post("/reset-password", updateForgotPasswordController);


export default authRouter;