import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// Register
export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return next(new Error("User already exists"))
    }
    const newUser = new User({
        username, email, password
    })
    await newUser.save()
    res.status(200).json({
        success: true,
        message: "User registered successfully"
    })
}

// Login

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && await user.comparePassword(password)) {
        const accessToken = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d"
        })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } else {
        res.status(400)
        return next(new Error("Invalid Credentials"))
    }

}


export const refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken
    if (!token) {
        res.status(400)
        return next(new Error("No refresh token provided"))
    }
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
        res.status(404)
        return next(new Error("User not found"))
    }
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })
    res.status(200).json({
        accessToken, user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}


export const logout = async (req, res, next) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000

    })
    res.status(200).json({ message: "Logout Success" })
}