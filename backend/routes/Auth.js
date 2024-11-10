import express from 'express'
import { Login,Register, Logout } from '../controllers/Auth.js'

const AutRoutes = express.Router()
AutRoutes.post('/register', Register)
AutRoutes.post('/login', Login)
AutRoutes.post('/logout', Logout)

export default AutRoutes