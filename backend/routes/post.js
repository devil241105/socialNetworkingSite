import express from 'express'
import { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, commentOnPost, deleteComment } from '../controllers/post.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const postRoutes = express.Router()

postRoutes.post('/post/upload', (req, res, next) => {
    console.log("Route hit: /post/upload");
    next();
},jwtAuthMiddleware, createPost);
postRoutes.post('/post/:id',jwtAuthMiddleware, likeAndUnlikePost);
postRoutes.delete('/post/:id',jwtAuthMiddleware, deletePost);
postRoutes.get('/post',jwtAuthMiddleware, getPostOfFollowing);
postRoutes.put('/post/comment/:id',jwtAuthMiddleware, commentOnPost); 
postRoutes.delete('/post/comment/:id',jwtAuthMiddleware, deleteComment);

export default postRoutes