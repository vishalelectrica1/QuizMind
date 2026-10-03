import React, { useState } from "react";
import { Lightbulb, PlayCircle, History as HistoryIcon, LogOut } from "lucide-react";
import QuizCustomizer from "./components/QuizCustomizer";
import QuizPlay from "./components/QuizPlay";
import QuizResults from "./components/QuizResults";
import History from "./components/History";
import AuthPage from "./components/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { generateQuiz } from "./services/gemini";
const API_URL = import.meta.env.VITE_API_URL;
// Inner app that uses auth context
function QuizApp() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("quiz");
  const [quizState, setQuizState] = useState("setup");
  const [quizData, setQuizData] = useState(null);
  const [results, setResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  // Show a blank screen while checking localStorage for existing token
  if (isLoading) {
    return (
      <div className="app-container" style={{ justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="loading-dots">
          <span className="dot dot-blue"></span>
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
      </div>
    );
  }

  // If not logged in, show the Auth page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleGenerate = async (selectedTopic, selectedDifficulty, count) => {
    setIsGenerating(true);
    setError("");
    setTopic(selectedTopic);
    setDifficulty(selectedDifficulty);
    setQuestionCount(count);

    try {
      const quiz = await generateQuiz(selectedTopic, selectedDifficulty, count);
      setQuizData(quiz);
      setQuizState("playing");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

const handleRetry = () => {
  setResults([]);
  setQuizState("playing");
};

const handleNewQuiz = () => {
  setResults([]);
  setQuizData(null);
  setQuizState("setup");
  setActiveTab("quiz");
};

  const handleQuizComplete = async (quizAnswers) => {
  const correctCount = quizAnswers.filter((r) => r.isCorrect).length;
  const token = localStorage.getItem("quizmind_token");

  try {
    const response = await fetch(`${API_URL}/api/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic,
        difficulty,
        correct: correctCount,
        total: quizAnswers.length,
      }),
    });

    const data = await response.json();

    console.log("History status:", response.status);
    console.log("History response:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to save history");
    }

    // Show result after saving
    setResults(quizAnswers);
    setQuizState("results");

  } catch (err) {
    console.error("Failed to save history:", err);

    // Still show the result even if history API fails
    setResults(quizAnswers);
    setQuizState("results");
  }
};

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <div className="logo-container">
          <Lightbulb className="logo-icon" size={40} />
          <h1 className="logo-text">QuizMind AI</h1>
        </div>
        <p className="subtitle">Instant, intelligent quizzes powered by Gemini</p>

        {/* User info + Logout */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
          <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            👋 Hello, <strong style={{ color: "var(--text-primary)" }}>{user?.name}</strong>
          </span>
          <button
            onClick={logout}
            className="btn-secondary"
            style={{ padding: "0.35rem 0.85rem", fontSize: "0.82rem", display: "inline-flex", width: "auto", gap: "0.4rem" }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      {quizState === "setup" && !isGenerating && (
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            <PlayCircle size={16} /> Generate Quiz
          </button>
          <button
            className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <HistoryIcon size={16} /> History
          </button>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, minHeight: "400px" }}>
        {isGenerating && (
          <div className="full-screen-loading">
            <div className="loading-dots">
              <span className="dot dot-blue"></span>
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <h2 className="loading-heading">Generating Your Quiz...</h2>
            <p className="loading-subtext">
              Please wait a moment while our AI creates {questionCount} unique questions for you.
            </p>
          </div>
        )}

        {!isGenerating && quizState === "setup" && activeTab === "quiz" && (
          <QuizCustomizer onGenerate={handleGenerate} isLoading={isGenerating} error={error} />
        )}

        {!isGenerating && quizState === "setup" && activeTab === "history" && (
          <History onStartNewQuiz={() => setActiveTab("quiz")} />
        )}

        {quizState === "playing" && quizData && (
          <QuizPlay quiz={quizData} onComplete={handleQuizComplete} />
        )}

        {quizState === "results" && (
          <QuizResults
            results={results}
            quizTopic={topic}
            quizDifficulty={difficulty}
            onRetry={handleRetry}
            onNewQuiz={handleNewQuiz}
          />
        )}
      </main>

      <footer style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Powered by Gemini 2.5 Flash &bull; React &bull; Node.js &bull; MongoDB
      </footer>
    </div>
  );
}

// Root app wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <QuizApp />
    </AuthProvider>
  );
}
