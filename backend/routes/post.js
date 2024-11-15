import express from 'express'
import { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing } from '../controllers/Auth.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const AutRoutes = express.Router()

AutRoutes.post('/post/upload',jwtAuthMiddleware, createPost);
AutRoutes.post('/post/:id',jwtAuthMiddleware, likeAndUnlikePost);
AutRoutes.delete('/post/:id',jwtAuthMiddleware, deletePost);
AutRoutes.delete('/post',jwtAuthMiddleware, getPostOfFollowing);

export default AutRoutes