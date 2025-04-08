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
    <div className="h-screen bg-[#fefbe9] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,0.2)] p-8 border-4 border-black relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-red-500">❤️ {hearts}</div>
          <div className="text-lg font-bold text-gray-800">
            Question {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{current.question}</h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {current.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`w-full px-6 py-4 rounded-xl border-4 text-lg font-semibold text-left transition-all duration-150 ${
                selectedOption === option
                  ? 'bg-green-600 text-white border-green-700 shadow-lg'
                  : 'bg-[#f0f0f0] hover:bg-yellow-100 border-black'
              }`}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center font-bold text-lg mb-4 ${
            feedback.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}>
            {feedback}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={!selectedOption || showFeedback}
            className="mt-2 px-8 py-3 bg-blue-600 text-white text-lg rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Submit & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;