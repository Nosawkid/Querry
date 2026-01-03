import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChat, addMessage, getAllChats, getChat } from "../controllers/chatController.js";

const router = express.Router();

router.use(verifyToken); // Protect all chat routes

router.get("/", getAllChats);

router.post("/", createChat);

router.get("/:id", getChat);

router.post("/:id/message", addMessage);

export default router;