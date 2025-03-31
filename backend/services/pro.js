import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { BrowserbaseLoader } from "@langchain/community/document_loaders/web/browserbase";
import { Document } from "langchain/document";
import * as dotenv from "dotenv";

dotenv.config();

//  Initialize Gemini AI model
const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    maxOutputTokens: 2048,
});

//  Use Gemini's embedding model
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
});

//  Initialize Vector Store (Memory-based)
let vectorStore = new MemoryVectorStore(embeddings); // Resets with each new upload

/**
 *  Store Extracted Text in Vector Database (Resets on New PDF)
 * @param {string} extractedText - The extracted text from the PDF
 * @param {string} pdfName - The name of the uploaded PDF
 */
export const storeExtractedText = async (extractedText, pdfName,url) => {
    try {
        console.log(`Storing extracted text from "${pdfName}" in vector database...`);

        //Reset vector store (to remove previous PDF context)
        vectorStore = new MemoryVectorStore(embeddings);

        if (extractedText) {

            const document = new Document({
                pageContent: extractedText,
                metadata: { source: pdfName }  // Track document source
            });

            //Embed the extracted text
            const vectors = await embeddings.embedDocuments([document.pageContent]);
            //Store vectors in memory (only for the new PDF)
            await vectorStore.addVectors(vectors, [document]);


        }else{
            const loader = new BrowserbaseLoader([`${url}`], {
                textContent: true,
              });
              const docs = await loader.load();

              //Embed the extracted text
            const vectors = await embeddings.embedDocuments([docs]);
            //Store vectors in memory (only for the new PDF)
            await vectorStore.addVectors(vectors, [docs]);
        }

        console.log("Extracted text stored successfully!");
    } catch (error) {
        console.error("Error storing extracted text:", error);
    }
};

/**
 * Query the Stored Text Data (Only Uses Current PDF)
 * @param {string} query - User's question
 * @returns {Promise<string>} - AI-generated response
 */
export const queryStoredText = async (query) => {
    try {
        console.log(`Searching for relevant content for: "${query}"...`);

        // Retrieve relevant chunks using similarity search
        const similarDocs = await vectorStore.similaritySearch(query, 2);

        if (!similarDocs.length) {
            console.log("⚠️ No relevant information found.");
            return "⚠️ No relevant information found in the document.";
        }

        const context = similarDocs.map(doc => doc.pageContent).join("\n");

        console.log("Using context:", context);

        // Format the prompt correctly for Gemini AI
        const messages = [
            { role: "system", content: "You are an AI assistant that answers questions based on provided PDF content." },
            { role: "user", content: `Question: ${query}\n\nContext:\n${context}` }
        ];

        // Invoke the AI model with structured chat messages
        const response = await model.invoke(messages);

        return response.content || "No response from AI.";
    } catch (error) {
        console.error("Error querying text:", error);
        return "Error processing request.";
    }
};
