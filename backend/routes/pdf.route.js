import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { storeExtractedText } from "../services/pro.js";


const pdfRoute = express.Router();

// Multer setup to store file in memory (not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
 
});



pdfRoute.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Received PDF file:", req.file.originalname);
    console.log("File size:", req.file.size, "bytes");

    // Extract text from the PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const pdfText = pdfData.text;

    if (!pdfText) {
      return res.status(400).json({ error: "Failed to extract text from PDF" });
    }

    console.log("Extracted PDF text:", pdfText);

    await storeExtractedText(pdfText);

    
    res.json({
      message: "PDF processed successfully!",
      fileName: req.file.originalname,
      fileSize: req.file.size,
      extractedText: pdfText.substring(0, 500) + "..." // Sending a preview
    });


  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: error.message });
  }
});

export default pdfRoute;
