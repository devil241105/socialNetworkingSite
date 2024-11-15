//register, login, logout


import userModel from "../models/Auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Register = async (req, res) => {
    try {
        const { userName, email, password, user = "user" } = req.body;
        const existingUser = await userModel.findOne({ email }).select("+password");
        if (existingUser) {
            return res.status(303).json({ success: false, message: "User already exists. Please log in." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            userName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(200).json({ success: true, message: "User registered successfully", User: newUser });
    } catch (error) {
        console.error("Registration error:", error.message);  // Log the specific error message
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
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
            httpOnly: true,
            secure: false,
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

export { Register, Login, Logout };