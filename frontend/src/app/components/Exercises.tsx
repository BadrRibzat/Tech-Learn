// frontend/src/app/components/Exercises.tsx
"use client";
import { useState, useEffect } from "react";

export default function Exercises({ lessonId }: { lessonId: string }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/learning/exercises/?lesson_id=${lessonId}`, {
      headers: { "Authorization": `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, [lessonId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8000/learning/check-answer/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({ lesson_id: lessonId, questionId: questions[currentQuestion].id, answer }),
    });
    const result = await response.json();
    setFeedback(result.correct ? "Correct Answer!" : "Try Again!");
    if (result.correct && currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer("");
        setFeedback("");
      }, 1000);
    }
  };

  if (!questions.length) return <div>Loading exercises...</div>;

  const question = questions[currentQuestion];
  return (
    <div className="w-96 border rounded p-2">
      <h2 className="text-lg font-bold">HTML Exercises</h2>
      <p className="text-sm">{question.text}</p>
      {question.options.map((opt, i) => (
        <div key={i} className="my-1">
          <input
            type="radio"
            id={`opt${i}`}
            name="answer"
            value={opt}
            checked={answer === opt}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <label htmlFor={`opt${i}`} className="ml-2">{opt}</label>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2"
      >
        Submit Answer
      </button>
      {feedback && <p className="mt-2 text-sm">{feedback}</p>}
    </div>
  );
}
