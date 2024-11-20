import express from 'express'
import { Login,Register, Logout, forgetPassword, resetPassword } from '../controllers/Auth.js'

const AutRoutes = express.Router()

AutRoutes.post('/register', Register)
AutRoutes.post('/login', Login)
AutRoutes.post('/logout', Logout)
AutRoutes.post('/forget/password', forgetPassword)
AutRoutes.post('/password/reset/:token', resetPassword)

export default AutRoutes