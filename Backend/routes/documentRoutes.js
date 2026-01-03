import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js'; // Ensure path is correct
import { uploadDocument, getUserDocuments, deleteDocument } from '../controllers/documentController.js';
import multer from 'multer'

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.use(verifyToken); // Protect all these routes

// --- 2. Routes ---

// Upload: Uses "upload.single('file')" to parse the incoming PDF
router.post('/upload', upload.single('file'), uploadDocument);

// Get All: Fetches the list for your Knowledge Base page
router.get('/', getUserDocuments);

// Delete: Removes a document
router.delete('/:id', deleteDocument);

export default router;