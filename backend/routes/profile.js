import express from 'express'
import { followUser } from '../controllers/profile.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const AutRoutes = express.Router()

AutRoutes.get('/follow/:id',jwtAuthMiddleware, followUser);

export default AutRoutes