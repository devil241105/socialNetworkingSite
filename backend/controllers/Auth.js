import userModel from "../models/Auth.js"
import bycript from "bcryptjs"
import jwt from "jsonwebtoken"


const Register = async (req,res)=>{
    try {
        const {userName, email, password, user="user"} = req.body
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res. status(303).json({success:false, message:"User Already Exist Please login"})
        }
        const hasepassword= await bycript.hashSync(password, 10)
        const NewUser = new userModel({
            userName, email, password:hasepassword
        })
        NewUser.save()
        res.status(200).json({success: true, message: "User Registered Successfully",User: NewUser })
    } catch (error) {
        console.log(error)
        return res. status(500).json({success:false, message:"Internal Server Error"})
    }
}


const Login = async(req, res) =>{
    try {
        const {email, password}= req.body
        const FindUser= await userModel.findOne({email})
        if(!FindUser){
            return res. status(404).json({success:false, message:"User not found please register"})
        }
        const comparePassword =  await bycript.compare(password, FindUser.password)
        if(!comparePassword){
            return res. status(303).json({success:false, message:"Invalid Password"})
        }
        const token = await jwt.sign({userId:FindUser._id}, process.env.SecretKey, {expiresIn:"3d"})
        res.cookie("token", token,{
            httpOnly:true,
            secure:false,
            maxAge: 3*24 * 3600 * 1000
        })
        return res.status(200).json({success:true, message:"Login successfully", user:FindUser, token})
    } catch (error) {
        console.log(error)
        return res. status(500).json({success:false, message:"Internal Server Error"})
    }
}

const Logout= async(req,res) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({success:false, message:"User Logout successfully"})
    } catch (error) {
        console.log(error)
        return res. status(500).json({success:false, message:"Internal Server Error"})
    }
}

export {Register, Login, Logout}