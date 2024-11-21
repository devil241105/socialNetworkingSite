import express from 'express'
import { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, commentOnPost, deleteComment } from '../controllers/post.js'
import { upload } from '../config/cloudinary.js';
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const postRoutes = express.Router()

postRoutes.post(
    '/post/upload',
    (req, res, next) => {
        console.log("Route hit: /post/upload");
        next();
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