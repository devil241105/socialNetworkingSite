import express from 'express'
import { followUser, deleteProfile, myProfile, getUserProfile, getAllUsers } from '../controllers/profile.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const profileRoutes = express.Router()

profileRoutes.get('/follow/:id',jwtAuthMiddleware, followUser);
profileRoutes.delete('/delete/me',jwtAuthMiddleware, deleteProfile);
profileRoutes.get('/me',jwtAuthMiddleware, myProfile);
profileRoutes.get('/user/:id',jwtAuthMiddleware, getUserProfile);
profileRoutes.get('/users',jwtAuthMiddleware, getAllUsers);

export default profileRoutes

