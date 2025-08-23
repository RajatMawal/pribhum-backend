import nodemailer from "nodemailer";
import "dotenv/config";

export const sendEmail = async (data) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASS,
      },
    });

    const mailOptions = {
      from: `"Pribhum Nest" <${process.env.HOSTINGER_EMAIL}>`,
      to: data.email,
      subject: `Pribhumnest Password Reset`,
      text: `Hello,

We received a request to reset the password for your Pribhumnest account associated with this email.

Your One-Time Password (OTP) is: ${data.otp}

This OTP is valid for 2 minutes.

If you did not request this password reset, please ignore this email or contact support.

Thank you,
The Pribhumnest Team
© 2025 Pribhumnest. All rights reserved.`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
};

export const verifyEmailOtp = async (data) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASS,
      },
    });

    const toStringOtp = data.otp.toString();

    const mailOption = {
      from: `"Pribhum Nest" <${process.env.HOSTINGER_EMAIL}>`,
      to: data.email,
      subject: `Register Account with Pribhumnest`,
      text: `Hello,

Thank you for registering with pribhunest!  
To complete your registration, please use the One-Time Password (OTP) below:

OTP: ${toStringOtp}

This code will expire in 2 minutes.  
If you did not request this, please ignore this email.

Best regards,  
The [YourAppName] Team
© 2025 Pribhumnest. All rights reserved.`,
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    next(error);
  }
};

export const enquiry =  async(data)=>{

}
