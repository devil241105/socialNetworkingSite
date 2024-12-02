import express from 'express'
import { Login,Register, Logout, forgetPassword, resetPassword } from '../controllers/Auth.js'
import { upload } from '../config/cloudinary.js';

const AutRoutes = express.Router()

AutRoutes.post(
    '/register',
    (req, res, next) => {
      console.log("Incoming Request - Body (raw):", req.body);
      next();
    },
    upload,
    (req, res, next) => {
      console.log("After Multer Middleware:");
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
      if (!req.body || !req.file) {
        return res.status(400).json({
          success: false,
          message: "Invalid form-data. Please include all required fields and a file.",
        });
      }
      next();
    },
    Register
  );
  
AutRoutes.post('/login', Login)
AutRoutes.post('/logout', Logout)
AutRoutes.post('/forget/password', forgetPassword)
AutRoutes.post('/password/reset/:token', resetPassword)

export default AutRoutes