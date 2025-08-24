import BookingForm from "../Model/BookingForm.js";
import Property from "../Model/Property.js";
import User from "../Model/User.js";
import nodemailer from "nodemailer"

export const addProperty = async (req, res, next) => {
  try {
    const images = req.files.map((file) => file.path);
    const pgId = `PG${Math.floor(Math.random() * 1000000)}`;
    const userId = req._id

    console.log("req._id:", req._id);
console.log("req.files:", req.files);
console.log("req.body:", req.body);

    const createdBy = await User.findById(userId)


    const Sharing = JSON.parse(req.body.Sharing);
    const CommonFacilities = JSON.parse(req.body.CommonFacilities);
    const Safety = JSON.parse(req.body.Safety);
    const BillsIncluded = JSON.parse(req.body.BillsIncluded);

    const property = await Property.create({
      pgId,
      createdBy:createdBy.name,
      Title: req.body.Title,
      Locality: req.body.Locality,
      City: req.body.City,
      Gender: req.body.Gender,
      LockInPeriod: req.body.LockInPeriod,
      Electricity: req.body.Electricity,
      Images: images,
      Sharing,
      CommonFacilities,
      Safety,
      BillsIncluded,
    });

    res.status(201).json({ message: "Property added", data: property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const allProperty = async(req,res)=>{
  try {
    const findProperty = await Property.find({})
    if(!findProperty){
      const error = new Error("User not found")
      error.statusCode = 404
      throw (error)
    }
    res.status(200).json({findProperty})
  } catch (error) {
    next(error)
  }
}

export const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;

    await Property.findByIdAndDelete(id);

    res.status(200).json({ message: "Delete Property Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const propertyFind = async(req,res)=>{
  try{
    const id = req.params.id

    if(!id){
      const error = new Error("user not found")
      error.statusCode = 404
      throw error
    }

    const property = await Property.findById(id)

    res.status(200).json({property})
  }
  catch(error){
    return next(error)
  }
}


export const bookingForm = async (req, res, next) => {
  try {
    const { fullName, contact, days } = req.body;

    const id = req._id;     
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(!fullName || !contact || !days)
    {
      const error = new Error("All Fields are required")
      error.status = 400
      throw (error)
    }

    const userEmail = user.email;

  
    const newEnquiry = new BookingForm({
      fullName,
      contact,
      days,
      email: user.email,
    });
    await newEnquiry.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${fullName}" <${process.env.EMAIL_USER}>`,
      replyTo: userEmail,
      to: "nestpribhum@gmail.com", 
      subject: "Enquiry For Pg",
      html: `
        <h2>New Enquiry recived</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${userEmail}</p>
        <p><b>Contact:</b> ${contact}</p>
        <p><b>Days:</b> ${days}</p>
      `,
    });

    res.status(200).json({ success: true, message: "Enquiry sent successfully" });
  } catch (error) {
    return next(error);
  }
};
