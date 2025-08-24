import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    const str = process.env.MONGODB_URI;
    if (!str) return console.log("MongoDb uri not found");
    await mongoose.connect(str);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "server error" });
  }
};

export default connectDB