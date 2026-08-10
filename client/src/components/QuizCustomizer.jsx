import React, { useState } from "react";
import { BookOpen, Sparkles, AlertCircle } from "lucide-react";

const SUGGESTIONS = [
  "Animals & Nature",
  "Disney Movies",
  "Solar System Planets",
  "Basic Math",
  "World Flags",
  "Fruits & Vegetables",
  "Cricket"
];

export default function QuizCustomizer({ onGenerate, isLoading, error }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), difficulty, 5); // 5 questions preset
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Generate Custom Quiz
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Enter a topic and select difficulty. Our AI will build a personalized quiz for you!
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              background: "var(--error-glow)",
              border: "1px solid var(--error-border)",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              color: "#fecaca",
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0, color: "var(--error)", marginTop: "2px" }} />
            <div style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
              {error}
            </div>
          </div>
        )}

        {/* Topic Input & Suggestions */}
        <div className="form-group">
          <label htmlFor="quiz-topic" className="form-label">
            <BookOpen size={18} />
            Quiz Topic
          </label>
          <input
            id="quiz-topic"
            type="text"
            className="text-input"
            placeholder="e.g. World War II, Photosynthesis, Solar System"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            required
            maxLength={100}
          />
          
          {/* Clickable suggestion pills */}
          <div 
            style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "0.5rem", 
              marginTop: "0.85rem" 
            }}
          >
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-pill"
                onClick={() => setTopic(suggestion)}
                disabled={isLoading}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "50px",
                  color: "var(--text-secondary)",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "var(--transition-smooth)",
                  fontFamily: "var(--font-family)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(139, 92, 246, 0.12)";
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.color = "var(--text-primary)";
                  e.target.style.boxShadow = "0 0 10px rgba(139, 92, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.03)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.target.style.color = "var(--text-secondary)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
          <label className="form-label">
            <Sparkles size={18} />
            Difficulty Level
          </label>
          <div className="difficulty-grid">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                type="button"
                className={`difficulty-btn ${difficulty === level ? "active" : ""}`}
                onClick={() => setDifficulty(level)}
                disabled={isLoading}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? "Creating Quiz..." : "Generate AI Quiz"}
        </button>
      </form>
    </div>
  );
}
