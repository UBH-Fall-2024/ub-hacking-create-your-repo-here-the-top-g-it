const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to summarize provided text
app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes text." },
        { role: "user", content: `Please summarize the following text:\n\n"${text}"` },
      ],
      max_tokens: 150,
    });

    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to summarize text." });
  }
});

// Endpoint to generate questions based on text input
app.post("/generate_questions", async (req, res) => {
  const { text } = req.body;

  try {
    const questionCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates multiple-choice questions." },
        { role: "user", content: `Based on the following text, generate a multiple-choice question in JSON format with fields 'question', 'choices' (an array of 4 options), and 'correct_answer' (one of the options).\n\nText: "${text}"` },
      ],
      max_tokens: 200,
    });

    const generatedResponse = questionCompletion.choices[0].message.content.trim();
    console.log("Generated Response:", generatedResponse);

    let questionData;
    try {
      questionData = JSON.parse(generatedResponse);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return res.status(500).json({ error: "Failed to parse question format from AI response." });
    }

    if (!questionData.question || !questionData.choices || !questionData.correct_answer) {
      return res.status(500).json({ error: "Invalid question format." });
    }

    const { question, choices, correct_answer } = questionData;
    res.json({ questions: [{ question, choices, correct_answer }] });
  } catch (error) {
    console.error("Error in /generate_questions:", error);
    res.status(500).json({ error: "Failed to generate questions." });
  }
});

// Endpoint to upload and summarize a PDF
app.post("/upload_pdf", async (req, res) => {
  const { fileData, fileName } = req.body;
  const buffer = Buffer.from(fileData, "base64");

  try {
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    if (!pdfText) {
      return res.status(400).json({ error: "No extractable text found in the PDF." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes text." },
        { role: "user", content: `Please summarize the following text:\n\n"${pdfText}"` },
      ],
      max_tokens: 150,
    });

    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF file." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
