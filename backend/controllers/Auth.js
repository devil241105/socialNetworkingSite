//register, login, logout


import userModel from "../models/Auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendEmail} from "../middlewares/sendEmail.js"
import crypto from 'crypto';

const Register = async (req, res) => {
    try {
      const { userName, email, password } = req.body;
  
      if (!userName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: userName, email, password",
        });
      }
  
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File upload is required",
        });
      }
  
      const { path: url, filename: public_id } = req.file;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new userModel({
        userName,
        email,
        password: hashedPassword,
        avatar: { url, public_id },
      });
  
      await newUser.save();
  
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          userName: newUser.userName,
          email: newUser.email,
          avatar: newUser.avatar,
        },
      });
    } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const foundUser = await userModel.findOne({ email }).select("+password");
        if (!foundUser) {
            return res.status(404).json({ success: false, message: "User not found. Please register." });
        }

        console.log("Retrieved user:", foundUser); // Debug logging
        console.log("Stored hashed password:", foundUser.password); 

        const comparePassword = await bcrypt.compare(password, foundUser.password); 
        if (!comparePassword) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
       

        res.cookie("token", token, {
            secure: true, 
            httpOnly: true,
            sameSite:'None',
            maxAge: 3 * 24 * 3600 * 1000,
        }); 
        return res.status(200).json({ success: true, message: "Login successful", user: foundUser, token });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const forgetPassword = async (req,res) => {
    try{
        const user = await userModel.findOne({email:req.body.email});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const resetPasswordToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/auth/password/reset/${resetPasswordToken}`;
        console.log(resetUrl);
        const message = `reset your password by clicking on the link below \n\n ${resetUrl}`

        try{
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                message,
            });
        return res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        });
        }catch(error){
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const resetPassword = async (req, res) => {
    try {
        console.log("Token received:", req.params.token);// debug log

        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        console.log("Hashed Token:", resetPasswordToken);// debug log

        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or has expired",
            });
        }

        console.log("User found:", user);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




export { Register, Login, Logout, forgetPassword, resetPassword };