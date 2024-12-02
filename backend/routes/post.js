import express from 'express'
import { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, commentOnPost, deleteComment } from '../controllers/post.js'
import { upload } from '../config/cloudinary.js';
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const postRoutes = express.Router()

postRoutes.post(
    '/post/upload',
    (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'File is required for this request',
          });
        }
  
        const { caption } = req.body;
        if (!caption || caption.trim() === '') {
          return res.status(400).json({
            success: false,
            message: 'Caption is required for this request',
          });
        }
        next();
      } catch (error) {
        console.error('Error in validation middleware:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message,
        });
      }
    },
    jwtAuthMiddleware,
    upload,
    (req, res, next) => {
        try {
            const { caption } = req.body;
            req.body.caption = caption;

            console.log('Caption:', caption);

            next();
        } catch (error) {
            console.error("Error parsing data:", error.message);
            return res.status(400).json({
                success: false,
                message: "Invalid data format",
            });
        }
    },
    createPost 
);
postRoutes.post('/post/:id',jwtAuthMiddleware, likeAndUnlikePost);
postRoutes.delete('/post/:id',jwtAuthMiddleware, deletePost);
postRoutes.get('/post',jwtAuthMiddleware, getPostOfFollowing);
postRoutes.put('/post/comment/:id',jwtAuthMiddleware, commentOnPost); 
postRoutes.delete('/post/comment/:id',jwtAuthMiddleware, deleteComment);

export default postRoutes