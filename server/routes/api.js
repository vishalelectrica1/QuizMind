const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const History = require("../models/History");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Route: Generate a new quiz (Protected)
router.post("/generate-quiz", verifyToken, async (req, res) => {
  const { topic, difficulty, count = 5 } = req.body;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_actual_gemini_api_key_here") {
    return res.status(500).json({ error: "Missing or invalid Gemini API Key in server/.env file" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are a professional quiz generator. Generate highly accurate, engaging, and age-appropriate quiz questions. Each question must have four plausible options but only one unambiguously correct answer, along with a clear, concise explanation of the correct choice.",
    });

    const prompt = `Generate a quiz on the topic: "${topic}" with difficulty level: "${difficulty}". 
The quiz must contain exactly ${count} questions.

You must return a JSON object that adheres strictly to this structure:
{
  "title": "Engaging Quiz Title",
  "description": "Brief description of the quiz topic and difficulty",
  "questions": [
    {
      "id": 1,
      "question": "The question text here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Option 1",
      "explanation": "Why Option 1 is the correct answer."
    }
  ]
}

Make sure that:
1. The correct_answer string matches exactly one of the strings inside the options array.
2. The options are realistic and challenging but clear.
3. The explanation is educational and explains why the correct option is right.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const responseText = result.response.text();
    if (!responseText) throw new Error("Received empty response from Gemini API.");

    const quizData = JSON.parse(responseText);
    if (!quizData.title || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error("Generated quiz format is invalid.");
    }

    res.json(quizData);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// Route: Save quiz result (Protected)
router.post("/history", verifyToken, async (req, res) => {
  try {
    const { topic, difficulty, correct, total } = req.body;
    const newHistory = new History({
      userId: req.userId,
      topic,
      difficulty,
      correct,
      total,
    });
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    console.error("Save History Error:", error);
    res.status(500).json({ error: "Failed to save history" });
  }
});

// Route: Get quiz history for logged-in user (Protected)
router.get("/history", verifyToken, async (req, res) => {
  try {
    const history = await History.find({ userId: req.userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Route: Delete all history for logged-in user (Protected)
router.delete("/history", verifyToken, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.userId });
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Delete History Error:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

module.exports = router;
