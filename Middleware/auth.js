import jwt from "jsonwebtoken";
import "dotenv/config";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.Token;

    if (!token) {
      const error = new Error("Login to Access");
      error.statusCode = 401;
      return next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        const error = new Error("unauthorized token");
        error.statusCode = 403;
        return next(error);
      }
      req._id = decoded._id;
      next();
    });
  } catch (error) {
    return next(error);
  }
};

export const otpAuth = async (req, res, next) => {
  const token = req.headers["Authorization"].split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No Token Provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET,(error, decoded) => {
      if (error) {
        const error = new Error("unauthorized token");
        error.statusCode = 403;
        return next(error);
      }
      req._id = decoded._id;
      next();
    });
    if(!decoded) return res.status(403).json({ message: "OTP verification required" });
    req.user = decoded;   
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid or expired" });
  }
};
