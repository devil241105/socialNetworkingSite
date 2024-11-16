import express from 'express'
import { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, commentOnPost, deleteComment } from '../controllers/Auth.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const AutRoutes = express.Router()

AutRoutes.post('/post/upload',jwtAuthMiddleware, createPost);
AutRoutes.post('/post/:id',jwtAuthMiddleware, likeAndUnlikePost);
AutRoutes.delete('/post/:id',jwtAuthMiddleware, deletePost);
AutRoutes.get('/post',jwtAuthMiddleware, getPostOfFollowing);
AutRoutes.put('/post/comment/:id',jwtAuthMiddleware, commentOnPost); 
AutRoutes.delete('/post/comment/:id',jwtAuthMiddleware, deleteComment);

export default AutRoutes