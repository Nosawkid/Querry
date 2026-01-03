import express from 'express'
import { loginUser, logout, refreshToken, registerUser } from '../controllers/authController.js'
const router = express.Router()


router.post("/", registerUser)
router.post("/login", loginUser)
router.post("/logout", logout)
router.get("/refresh", refreshToken)












export default router