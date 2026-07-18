import React, { useState, useEffect } from "react";
import { Lightbulb, PlayCircle, History as HistoryIcon } from "lucide-react";
import QuizCustomizer from "./components/QuizCustomizer";
import QuizPlay from "./components/QuizPlay";
import QuizResults from "./components/QuizResults";
import History from "./components/History";
import { generateQuiz } from "./services/gemini";

export default function App() {
  const [activeTab, setActiveTab] = useState("quiz"); // "quiz" or "history"
  const [quizState, setQuizState] = useState("setup"); // "setup", "playing", "results"
  const [quizData, setQuizData] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Track parameters for results view
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  const handleGenerate = async (selectedTopic, selectedDifficulty, count) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (quizAnswers) => {
    setResults(quizAnswers);
    setQuizState("results");

    // Save to history
    const correctCount = quizAnswers.filter((r) => r.isCorrect).length;
    const historyEntry = {
      topic,
      difficulty,
      correct: correctCount,
      total: quizAnswers.length,
      timestamp: new Date().toISOString(),
    };

    const savedHistory = localStorage.getItem("quiz_history");
    let historyList = [];
    if (savedHistory) {
      try {
        historyList = JSON.parse(savedHistory);
      } catch (e) {
        console.error(e);
      }
    }
    historyList.unshift(historyEntry); // Put newest first
    localStorage.setItem("quiz_history", JSON.stringify(historyList));
  };

  const handleRetry = () => {
    setQuizState("playing");
  };

  const handleNewQuiz = () => {
    setQuizState("setup");
    setQuizData(null);
    setResults([]);
    setActiveTab("quiz");
  };

  return (
    <div className="app-container">
      {/* Header - centered title */}
      <header>
        <div className="logo-container">
          <Lightbulb className="logo-icon" size={40} />
          <h1 className="logo-text">QuizMind AI</h1>
        </div>
        <p className="subtitle">Instant, intelligent quizzes powered by Gemini</p>
      </header>

      {/* Tabs (Hidden during active quiz play for maximum focus) */}
      {quizState === "setup" && !isLoading && (
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            <PlayCircle size={16} />
            Generate Quiz
          </button>
          <button // Hiding the quiz tab as it's the default and only option during setup
            className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <HistoryIcon size={16} />
            History
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, minHeight: '400px' }}>
        {isLoading && (
          <div className="full-screen-loading">
            <div className="loading-dots">
              <span className="dot dot-blue"></span>
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <h2 className="loading-heading">Generating Your Quiz...</h2>
            <p className="loading-subtext">Please wait a moment while our AI creates {questionCount} unique questions for you.</p>
          </div>
        )}

        {!isLoading && quizState === "setup" && activeTab === "quiz" && (
          <QuizCustomizer
            onGenerate={handleGenerate}
            isLoading={isLoading}
            error={error}
          />
        )}

        {!isLoading && quizState === "setup" && activeTab === "history" && (
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

      {/* Subtle footer */}
      <footer style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Powered by Gemini 2.5 Flash &bull; React &bull; Vanilla CSS
      </footer>
    </div>
  );
}
