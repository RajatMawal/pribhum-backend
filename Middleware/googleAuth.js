import User from "../Model/User.js"
import generateToken from "./generateToken.js";

const googleAuth = async(req,res,next)=>{
 try {
     const email = req.user?._json?.email;
    const name = req.user?._json?.name;

    let findedUser = await User.findOne({email:req.user?._json?.email})

    let newUser;
    if(!findedUser){
        newUser = await User.create({
            name,email
        })
    }
    const accessToken = generateToken(findedUser ? findedUser._id : newUser._id)
    res.cookie("Token",accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    })
    next()
 } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({message:"server Error"})
 }
}

export default googleAuth