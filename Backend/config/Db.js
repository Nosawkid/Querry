import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(conn.connection.host)
        console.log("Connection Success")
    } catch (error) {
        console.log("Mongo DB connection failed")
        console.log(error)
    }
}


export default connectDB