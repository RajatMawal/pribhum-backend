import express from "express";
import { sendOtp, verifyOtp } from "../Controlles.js/otpController.js";

const otpRouter = express.Router();

otpRouter.post("/send-otp", sendOtp);
otpRouter.post("/verify-otp", verifyOtp);

export default otpRouter
