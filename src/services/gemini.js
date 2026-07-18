import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!envKey || envKey === "your_actual_gemini_api_key_here") {
    return null;
  }
  return envKey;
};

/**
 * Generates a quiz based on topic, difficulty, and number of questions using Gemini API.
 * @param {string} topic 
 * @param {string} difficulty 
 * @param {number} count 
 * @returns {Promise<object>} Quiz JSON object
 */
export async function generateQuiz(topic, difficulty, count = 5) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error(
      "Missing Gemini API Key. Please add VITE_GEMINI_API_KEY=your_key_here to the .env file in the root folder of this project, then restart the dev server."
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-2.5-flash as the standard, fast, and highly capable model for content generation
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: 
        "You are a professional quiz generator. Generate highly accurate, engaging, and age-appropriate quiz questions. Each question must have four plausible options but only one unambiguously correct answer, along with a clear, concise explanation of the correct choice."
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
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error("Received empty response from Gemini API.");
    }

    const quizData = JSON.parse(responseText);
    
    // Basic verification of the quiz format
    if (!quizData.title || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error("Generated quiz format is invalid.");
    }

    return quizData;
  } catch (error) {
    console.error("Gemini service error:", error);
    
    // Provide a cleaner user-facing message if it's an API key error
    if (error.message && error.message.includes("API key")) {
      throw new Error("Invalid Gemini API Key. Please verify the key in your .env file is correct.");
    }
    
    throw error;
  }
}
