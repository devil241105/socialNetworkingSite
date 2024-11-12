// import userModel from "../models/Auth.js"
// import bycript from "bcryptjs"
// import jwt from "jsonwebtoken"


// const Register = async (req,res)=>{
//     try {
//         const {userName, email, password, user="user"} = req.body
//         const existingUser = await userModel.findOne({email})
//         if(existingUser){
//             return res. status(303).json({success:false, message:"User Already Exist Please login"})
//         }
//         const hasepassword= await bycript.hashSync(password, 10)
//         const NewUser = new userModel({
//             userName, email, password:hasepassword
//         })
//         NewUser.save()
//         res.status(200).json({success: true, message: "User Registered Successfully",User: NewUser })
//     } catch (error) {
//         console.log(error)
//         return res. status(500).json({success:false, message:"Internal Server Error"})
//     }
// }


// const Login = async(req, res) =>{
//     try {
//         const {email, password}= req.body
//         const FindUser= await userModel.findOne({email})
//         if(!FindUser){
//             return res. status(404).json({success:false, message:"User not found please register"})
//         }
//         const comparePassword =  await bycript.compare(password, FindUser.password)
//         if(!comparePassword){
//             return res. status(303).json({success:false, message:"Invalid Password"})
//         }
//         const token = await jwt.sign({userId:FindUser._id}, process.env.SecretKey, {expiresIn:"3d"})
//         res.cookie("token", token,{
//             httpOnly:true,
//             secure:false,
//             maxAge: 3*24 * 3600 * 1000
//         })
//         return res.status(200).json({success:true, message:"Login successfully", user:FindUser, token})
//     } catch (error) {
//         console.log(error)
//         return res. status(500).json({success:false, message:"Internal Server Error"})
//     }
// }

// const Logout= async(req,res) => {
//     try {
//         res.clearCookie('token')
//         return res.status(200).json({success:false, message:"User Logout successfully"})
//     } catch (error) {
//         console.log(error)
//         return res. status(500).json({success:false, message:"Internal Server Error"})
//     }
// }

// export {Register, Login, Logout}





import userModel from "../models/Auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Register = async (req, res) => {
    try {
        const { userName, email, password, user = "user" } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(303).json({ success: false, message: "User already exists. Please log in." });
        }

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new userModel({
            userName,
            email,
            password: hashedPassword,
        });

        // Save the user and await completion
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

        // Ensure both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // Find the user
        const foundUser = await userModel.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({ success: false, message: "User not found. Please register." });
        }

        console.log("Retrieved user:", foundUser); // Debug logging
        console.log("Stored hashed password:", foundUser.password); // Check if password is defined

        // Compare the provided password with the hashed password
        const comparePassword = await bcrypt.compare(password, foundUser.password); 
        if (!comparePassword) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        // Generate JWT token
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