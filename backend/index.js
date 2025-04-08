import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define a generative model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Route to generate text
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ text: response });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'An error occurred while generating content' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});