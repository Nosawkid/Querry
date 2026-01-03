import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createChat = async (req, res, next) => {
    const newChat = new Chat({
        userId: req.user._id,
        history: []
    })

    const createdChat = await newChat.save()
    res.status(200).json({ success: true, message: "Chat session created", chat: createdChat })
}


export const addMessage = async (req, res) => {
    const { id } = req.params;
    const { question } = req.body;

    if (!question) throw new Error("Question is required");

    const chat = await Chat.findOne({ _id: id, userId: req.user._id });
    if (!chat) throw new Error("Chat not found");

    const documents = await Document.find({ userId: req.user._id });

    let contextData = "";
    if (documents.length > 0) {
        contextData = documents.map(doc =>
            `DOCUMENT_ID: ${doc._id}\nTITLE: ${doc.title}\nCONTENT: ${doc.content}`
        ).join("\n\n");
    } else {
        return res.status(200).json({
            success: true,
            message: { answer: "Please upload a document first.", citations: [] }
        });
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const historyContext = chat.history.slice(-3).map(h => `User: ${h.question}\nAI: ${h.answer}`).join("\n");

    const prompt = `
        You are a helpful knowledge assistant.
        
        CONTEXT:
        ${contextData}

        CHAT HISTORY:
        ${historyContext}

        QUESTION: 
        ${question}

        INSTRUCTIONS:
        1. Answer the question using ONLY the provided context.
        2. Provide citations for every claim.
        3. Output strict JSON:
        {
            "answer": "...",
            "citations": [{ "docTitle": "...", "snippet": "..." }]
        }
    `;

    const result = await model.generateContent(prompt);
    const parsedResponse = JSON.parse(result.response.text());

    if (chat.history.length === 0) {
        chat.title = question.substring(0, 30) + "...";
    }

    const newMessage = {
        question,
        answer: parsedResponse.answer,
        citations: parsedResponse.citations || []
    };

    chat.history.push(newMessage);
    await chat.save();

    res.status(200).json({
        success: true,
        message: newMessage
    });
};


export const getAllChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ userId: req.user._id })
            .select("title updatedAt")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, chats });
    } catch (error) {
        next(error);
    }
};


export const getChat = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
        if (!chat) {
            return next(new Error("Chat not found"));
        }
        res.status(200).json({ success: true, chat });
    } catch (error) {
        next(error);
    }
};