import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userId:{type:String,unique:true},
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique:true,
        required:true
    },
    contact:{
        type:String,
        match:/^\d{10}$/,
        unique:true,
    },
    password:{
        type:String,
        minLength:6,
    },
    role:{
        type:"string",
        enum:["user","pg-owner","admin"],
        default:"user"
    },
    password_otp:{
        otp:{type:String},
        send_time:{type:String},
        expiry_time:{type:String},
        limit:{type:Number,default:5},
        last_attempt:{type:Object}
    }
},{timestamps:true})


export default mongoose.model("User",userSchema)
