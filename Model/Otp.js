import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{type:String},
    otp:{type:String , required:true},
    send_time:{type:String},
    limit:{type:Number, default:6},
    expiry_time:{type:String},
    last_attempt:{type:Object, default:{}}
},{timestamps:true})


export default mongoose.model("Otp", otpSchema);