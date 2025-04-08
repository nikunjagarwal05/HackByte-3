import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionBank from './questions.js';

const ExamPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const questions = questionBank[sectionId] || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const current = questions[currentQuestion];
    const isCorrect = selectedOption === current.answer;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('✅ Correct!');
    } else {
      setHearts(hearts - 1);
      setFeedback(`❌ Incorrect! Correct answer: ${current.answer}`);
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption('');

      if (hearts - (isCorrect ? 0 : 1) <= 0) {
        setCompleted(true);
        return;
      }

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };

  const restartExam = () => {
    setCurrentQuestion(0);
    setSelectedOption('');
    setScore(0);
    setHearts(3);
    setFeedback('');
    setShowFeedback(false);
    setCompleted(false);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!questions.length) return <div className="p-4">No questions found.</div>;

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-4">
            {hearts > 0 ? '🎉 Exam Completed!' : '💔 You ran out of hearts!'}
          </h1>
          <p className="mb-4 text-lg">Score: {score} / {questions.length}</p>
          <div className="space-x-4">
            <button onClick={restartExam} className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600">Retry</button>
            <button onClick={goBack} className="px-4 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className="h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="w-[70vw] h-[70vh] bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">❤️ {hearts}</div>
          <div className="text-lg font-bold">Question {currentQuestion + 1} / {questions.length}</div>
        </div>
        <h2 className="text-3xl font-bold mb-10">{current.question}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {current.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`px-6 py-6 rounded-xl border text-left transition-all duration-150 ${
                selectedOption === option
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
              }`}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`text-center font-semibold ${feedback.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {feedback}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={!selectedOption || showFeedback}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 disabled:opacity-50"
          >
            Submit & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;