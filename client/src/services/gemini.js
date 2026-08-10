const API_URL = "http://localhost:5000/api";

/**
 * Generates a quiz via the Express backend (which calls Gemini AI).
 * Sends the JWT token in the Authorization header.
 */
export async function generateQuiz(topic, difficulty, count = 5) {
  const token = localStorage.getItem("quizmind_token");

  try {
    const response = await fetch(`${API_URL}/generate-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topic, difficulty, count }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate quiz from server");
    }

    return await response.json();
  } catch (error) {
    console.error("API service error:", error);
    throw error;
  }
}
