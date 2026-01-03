import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "New Conversation"
    },
    history: [
        {
            question: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            citations: [
                {
                    documentId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Document"
                    },
                    docTitle: String,
                    snippet: String
                }
            ]
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;