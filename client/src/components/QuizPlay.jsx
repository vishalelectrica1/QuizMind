import React, { useState, useEffect, useRef } from "react";
import { Clock, ChevronRight } from "lucide-react";

export default function QuizPlay({ quiz, onComplete }) {
  const { title, questions } = quiz;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]); // tracks user's choices
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  
  const timerRef = useRef(null);
  const currentQuestion = questions[currentIdx];

  // Start/Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setSelectedOption(null);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIdx]);

  const handleTimeOut = () => {
    const finalSelection = selectedOption || "Time Out";
    recordAnswerAndAdvance(finalSelection);
  };

  const recordAnswerAndAdvance = (selection) => {
    clearInterval(timerRef.current);
    
    const isCorrect = selection === currentQuestion.correct_answer;
    const answerInfo = {
      questionId: currentQuestion.id,
      selected: selection,
      correct: currentQuestion.correct_answer,
      isCorrect,
      questionText: currentQuestion.question,
      options: currentQuestion.options,
      explanation: currentQuestion.explanation,
    };

    const newAnswers = [...answers, answerInfo];
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleNextClick = () => {
    if (!selectedOption) return;
    recordAnswerAndAdvance(selectedOption);
  };

  const progressPercentage = (currentIdx / questions.length) * 100;
  const isTimeLow = timeLeft <= 10;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
      {/* Quiz Progress & Timer */}
      <div className="quiz-header" style={{ marginTop: "0.5rem" }}>
        <div className="quiz-meta">
          <span className="quiz-badge">Question {currentIdx + 1} of {questions.length}</span>
        </div>
        <div className={`timer-box ${isTimeLow ? "warning" : ""}`}>
          <Clock size={18} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Question Text */}
      <h3 className="question-text">{currentQuestion.question}</h3>

      {/* Options List */}
      <div className="options-list" style={{ marginBottom: "1.5rem" }}>
        {currentQuestion.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedOption === option;

          return (
            <button
              key={index}
              className={`option-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedOption(option)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="option-marker">{letter}</span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <button
        onClick={handleNextClick}
        className="btn-primary"
        disabled={!selectedOption}
      >
        {currentIdx < questions.length - 1 ? (
          <>
            Next Question <ChevronRight size={18} />
          </>
        ) : (
          "Finish Quiz & View Results"
        )}
      </button>
    </div>
  );
}
