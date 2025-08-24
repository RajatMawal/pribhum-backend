import generateToken from "../Middleware/generateToken.js";
import User from "../Model/User.js";
import bcrypt from "bcrypt";
import { sendEmail } from "./sendMail.js";


export const register = async (req, res, next) => {
  try {
    const { name, email,contact, password } = req.body;

    const findUser = await User.findOne({ email });
    const userId = `UR${Math.floor(Math.random() * 1000000)}`;

    if (findUser) {
      const error = new Error("User already registered");
      error.statusCode = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    let newUser = await User.create({
      name,
      email,
      contact,
      userId,
      password: hashPassword,
    });

    const accessToken = generateToken(newUser._id);

    res.cookie("Token", accessToken, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });

    res
      .status(201)
      .json({ message: "Registered Successfully " });
  } catch (error) {
    next(error);
  }
};



export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findedUser = await User.findOne({ email });

    if (!findedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, findedUser.password);

    if (!isPasswordMatch) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 400;
      throw error;
    }

    const accessToken = generateToken(findedUser._id);

    res.cookie("Token", accessToken, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ message: "logged in successfully", findedUser });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const _id = req._id;
    const findUser = await User.findOne({ _id });
    if (!findUser) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "registered user",
      email: findUser.email,
      name: findUser.name,
    });
  } catch (error) {
    return next(error);
  }
};

export const findAllUser = async (req, res, next) => {
  try {
    const findUsers = await User.find({});
    if (!findUsers) {
      const error = new Error("Users not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json(findUsers);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("Token");
    res.clearCookie("connect.sid");

    res.status(200).json({ message: "user logout successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAccess = async (req, res, next) => {
  const id = req._id;
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ isAuthenticated: true, message: "success", user: findUser });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const{ email } = req.body;
  try {
    const findUser = await User.findOne({email});

    if (!findUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!findUser.password_otp) {
       findUser.password_otp = {
        limit: 5,
        otp: null,
        last_attempt: null,
        expiry_time: null
      };
    }


    const userOtp = findUser.password_otp?.otp;

    
    if (userOtp) {
      const userLastAttempt = findUser.password_otp?.last_attempt;
      const within24h =
        new Date().getTime() - new Date(userLastAttempt).getTime() <=
        24 * 60 * 60 * 1000;

      if (!within24h) {
        findUser.password_otp.limit = 5;
        await findUser.save();
      }

      const limitReached = findUser.password_otp.limit === 0;
      if (within24h && limitReached) {
        const error = new Error("Daily limit reached");
        error.statusCode = 400;
        throw error;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    findUser.password_otp.otp = otp.toString();
    findUser.password_otp.limit = (findUser.password_otp.limit || 5) - 1;
    findUser.password_otp.last_attempt = new Date();
    findUser.password_otp.expiry_time = Date.now() + 2 * 60 * 1000; // 2 mins

    await findUser.save();

    await sendEmail({email, otp });  

    res.status(200).json({
      message: `otp send to ${email}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const otpVerify = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const findOtp = await User.findOne({ "password_otp.otp": otp.toString() });

    if (!findOtp) {
      const error = new Error("Invalid OTP");
      error.statusCode = 400;
      throw error;
    }

    const otpExpired = findOtp.password_otp.expiry_time < Date.now();
    if (otpExpired) {
      const error = new Error("OTP Expired");
      error.statusCode = 400;
      throw error;
    }

    findOtp.password_otp.otp = null;
    findOtp.password_otp.expiry_time = null;

    await findOtp.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return next(error);
  }
};


export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "user deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

export const updateRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: role },
      { new: true }
    );

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Updated User Role Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role", error });
  }
};


export const updatePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;

    user.password_otp = {
      otp: null,
      expiry_time: null,
      limit: 5,
      last_attempt: null
    };

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
