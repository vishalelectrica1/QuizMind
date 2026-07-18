import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Trash2, Calendar, Award, Play } from "lucide-react";

export default function History({ onStartNewQuiz }) {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("quiz_history");
    if (savedHistory) {
      try {
        setHistoryList(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing quiz history:", e);
      }
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all quiz history?")) {
      localStorage.removeItem("quiz_history");
      setHistoryList([]);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      month: "short", 
      day: "numeric", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return "var(--success)";
    if (accuracy >= 60) return "#f59e0b"; // Amber
    return "var(--error)";
  };

  if (historyList.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <HistoryIcon size={48} className="empty-icon" />
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          No Quiz History Yet
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
          You haven't completed any quizzes yet. Generate a quiz above to start tracking your scores!
        </p>
        <button className="btn-primary" onClick={onStartNewQuiz} style={{ display: "inline-flex", width: "auto" }}>
          <Play size={18} /> Create Your First Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: "2rem" }}>
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "1rem"
        }}
      >
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Performance History</h3>
        <button 
          onClick={clearHistory}
          className="btn-secondary" 
          style={{ 
            padding: "0.5rem 1rem", 
            fontSize: "0.85rem", 
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#fca5a5" 
          }}
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="history-list">
        {historyList.map((entry, index) => {
          const accuracy = Math.round((entry.correct / entry.total) * 100);
          
          return (
            <div key={index} className="glass-panel history-card" style={{ background: "rgba(255, 255, 255, 0.01)" }}>
              <div className="history-details">
                <h4 className="history-topic">{entry.topic}</h4>
                <div className="history-meta-info">
                  <span className="quiz-badge" style={{ fontSize: "0.7rem", padding: "0.1rem 0.5rem" }}>
                    {entry.difficulty}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={12} />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="history-score-badge">
                <div 
                  className="history-score-val"
                  style={{ color: getAccuracyColor(accuracy) }}
                >
                  {entry.correct}/{entry.total}
                </div>
                <div className="history-score-percent">{accuracy}% accuracy</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
