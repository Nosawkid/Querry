import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/Db.js'
import cookieParser from 'cookie-parser'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
connectDB()




app.get("/", (req, res) => {
    res.json({ message: "Welcome to Querry" })
})

app.use("/api/auth", authRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/chats", chatRoutes)




app.use(notFound)
app.use(errorHandler)


















const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})


