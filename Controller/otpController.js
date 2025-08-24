import Otp from "../Model/Otp.js";
import  jwt  from "jsonwebtoken";
import "dotenv/config.js";
import User from "../Model/User.js";
import { verifyEmailOtp } from "./sendMail.js";

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let checkValue = {};
    if (isEmail) checkValue = { email };

    const findUser = await User.findOne(checkValue);
    const otpUser = await Otp.findOne({ email });

    if (findUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry_time = new Date(Date.now() + 2 * 60 * 1000); 


    const data = { email, otp };

    if (isEmail) {
      verifyEmailOtp(data);
    }

    if (otpUser) {
      await Otp.updateOne({ _id: otpUser._id }, { otp, expiry_time });
    } else {
      await Otp.create({ otp, expiry_time, email });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};


export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;


    const findData = await Otp.findOne({email,otp });
    if (!findData) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > new Date(findData.expiry_time).getTime()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    const otpToken = jwt.sign(
      { email: findData.email, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Otp.deleteOne({ _id: findData._id });

    res.status(200).json({
      message: "OTP verified successfully",
      token: otpToken,
    });
  } catch (error) {
    next(error);
  }
};

