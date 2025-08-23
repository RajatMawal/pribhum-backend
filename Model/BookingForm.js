import mongoose from "mongoose";

const bookingForm = new mongoose.Schema({
    fullName:{type:String , required:true},
    contact:{type:String , required:true},
    days:{type:String , required:true},
    email:{type:String}
})

export default mongoose.model("bookingForm", bookingForm);