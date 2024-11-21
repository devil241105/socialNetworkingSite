import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Your API key
    api_secret: process.env.CLOUDINARY_API_SECRET // Your API secret
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', // Optional: folder name in Cloudinary
      allowedFormats: ['jpg', 'png', 'jpeg'],
      public_id: (req, file) => file.originalname, // Use the original file name
    },
  });

const upload = multer({ storage: storage }).single('file');

export { upload };