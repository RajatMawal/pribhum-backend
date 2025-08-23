  import express from "express";
  import cors from "cors";
  import "dotenv/config";
  import cookieParser from "cookie-parser";
  import session from "express-session";
  import passport from "passport";
  import { Strategy as googleStrategy } from "passport-google-oauth20";
  import connectDB from "./Config/connectDB.js";
  import googleAuth from "./Middleware/googleAuth.js";
  import user from "./Routes/userRoute.js";
  import { errorhandler } from "./Middleware/errorHandler.js";
  import propertyRoute from "./Routes/propertyRoute.js";
import otpRouter from "./Routes/otpRoute.js";

  const app = express();

  const port = process.env.PORT || 9000;
  app.use(express.json());
  app.use(express.urlencoded({ extended: true}));

  app.use(cors({
      origin: "http://localhost:5173", 
      credentials: true,             
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], 
      allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(cookieParser())

  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  );

  // google loogin config
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          return done(null, profile);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
      prompt: "select_account",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:5173/login",
    }),
    googleAuth,
    (req, res) => {
      res.redirect("http://localhost:5173");
    }
  );

  app.use('/uploads', express.static('uploads'));




  app.use("/api/user",user);
  app.use("/api/property",propertyRoute);
  app.use("/api/otp",otpRouter);
  app.use(errorhandler);

  connectDB();
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
