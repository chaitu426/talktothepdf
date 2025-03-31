import express from 'express';
import { queryStoredText } from '../services/pro.js';

const chatRoute = express.Router();

/**
 * 🔹 Route: POST /msg
 * ✅ Accepts a user's query and retrieves relevant information from the stored text.
 */
chatRoute.post('/msg', async (req, res) => {
    try {
        const { input } = req.body;

        if (!input) {
            return res.status(400).json({ error: "Missing input in request body." });
        }

        console.log(`Received query: "${input}"`);

        // 🔍 Process the user's query
        const response = await queryStoredText(input);

        console.log(`AI Response: "${response}"`);

        // Send structured response
        return res.json({
            success: true,
            query: input,
            response: response
        });

    } catch (error) {
        console.error("Error processing query:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

export default chatRoute;
