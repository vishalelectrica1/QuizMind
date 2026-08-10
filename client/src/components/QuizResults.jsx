import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Plus, CheckCircle, XCircle } from "lucide-react";

export default function QuizResults({ results, quizTopic, quizDifficulty, onRetry, onNewQuiz }) {
  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // SVG parameters for the circular meter
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  useEffect(() => {
    if (accuracy >= 60) {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [accuracy]);

  const getEncouragement = () => {
    if (accuracy === 100) return "Master Class! Perfect Score! 🏆";
    if (accuracy >= 80) return "Outstanding Performance! 🌟";
    if (accuracy >= 60) return "Well Done! Good effort! 👍";
    return "Keep Learning! Practice makes perfect! 📚";
  };

  return (
    <div>
      <div className="glass-panel" style={{ padding: "2.5rem 2rem", marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {/* Animated SVG Progress Ring */}
          <div className="svg-score-container">
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circular track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Foreground progress track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="url(#score-gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))"
                }}
              />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="svg-score-text">
              <span style={{ fontSize: "2.15rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                {accuracy}%
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                {correctCount} / {totalQuestions}
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {getEncouragement()}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Topic: <strong style={{ color: "var(--text-primary)" }}>{quizTopic}</strong> &bull; Difficulty: <strong style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>{quizDifficulty}</strong>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="results-stats-grid">
          <div className="stat-card">
            <div className="stat-value correct">{correctCount}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value incorrect">{totalQuestions - correctCount}</div>
            <div className="stat-label">Incorrect / Missed</div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-secondary" onClick={onRetry} style={{ flex: 1 }}>
            <RotateCcw size={18} /> Retry Quiz
          </button>
          <button className="btn-primary" onClick={onNewQuiz} style={{ flex: 1 }}>
            <Plus size={18} /> New Quiz
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3 className="review-section-title">Question-by-Question Review</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {results.map((item, index) => {
            return (
              <div key={index} className="review-item" style={{ position: "relative" }}>
                {/* Visual marker showing correctness */}
                <div 
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    color: item.isCorrect ? "var(--success)" : "var(--error)"
                  }}
                >
                  {item.isCorrect ? "Correct" : "Incorrect"}
                </div>

                <div className="review-q-header">
                  <span className="review-q-num">Q{index + 1}.</span>
                  <span className="review-q-text">{item.questionText}</span>
                </div>

                <div className="review-options">
                  {item.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrectOpt = opt === item.correct;
                    const isUserSelected = opt === item.selected;
                    
                    let optClass = "";
                    if (isCorrectOpt) optClass = "correct";
                    else if (isUserSelected) optClass = "selected-incorrect";

                    return (
                      <div key={optIdx} className={`review-option ${optClass}`}>
                        <span>{letter}. {opt}</span>
                        {isCorrectOpt && <CheckCircle size={16} />}
                        {isUserSelected && !isCorrectOpt && <XCircle size={16} />}
                      </div>
                    );
                  })}
                </div>

                <div className="feedback-box" style={{ margin: 0, padding: "1.1rem 1.25rem", fontSize: "0.925rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.35rem", color: "var(--primary-hover)" }}>
                    AI Explanation:
                  </div>
                  <div style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {item.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
