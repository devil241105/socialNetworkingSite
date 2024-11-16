import express from 'express'
import { followUser, deleteProfile, myProfile } from '../controllers/profile.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const AutRoutes = express.Router()

AutRoutes.get('/follow/:id',jwtAuthMiddleware, followUser);
AutRoutes.delete('/delete/me',jwtAuthMiddleware, deleteProfile);
AutRoutes.get('/me',jwtAuthMiddleware, myProfile);

export default AutRoutes