import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.status(401)
        return next(new Error("No token provided"))
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.id).select("-password")
        if (!user) {
            res.status(404)
            return next(new Error("User not found"))
        }
        req.user = user
        next()

    } catch (err) {
        res.status(403)
        return next(new Error("Invalid or Expired Token"))
    }
}