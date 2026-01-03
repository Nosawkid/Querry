import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    processing: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "failed"]
    }
});

const Document = mongoose.model("Document", documentSchema);
export default Document;