import fs from 'fs/promises'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import Document from '../models/Document.js'


export const uploadDocument = async (req, res, next) => {
    if (!req.file) {
        return next(new Error("No file uploaded"))
    }

    const buffer = await fs.readFile(req.file.path);
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + "\n";
    }

    const newDoc = new Document({
        userId: req.user._id,
        title: req.file.originalname,
        content: fullText
    })

    await newDoc.save()
    await fs.unlink(req.file.path)

    res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        docId: newDoc._id
    });

}


export const getUserDocuments = async (req, res, next) => {
    try {
        const docs = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, documents: docs });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/documents/:id
export const deleteDocument = async (req, res, next) => {
    try {
        const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!doc) return next(new Error("Document not found"));
        res.status(200).json({ success: true, message: "Document deleted" });
    } catch (error) {
        next(error);
    }
};