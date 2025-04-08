import React, { useState, useEffect } from 'react';

function LLMOutput() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear dialog box when typing again
  useEffect(() => {
    if (text.trim()) {
      setResponse(null);
      setError(null);
    }
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatToBulletPoints = (text) => {
    return text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line, idx) => <li key={idx} className="ml-4 list-disc">{line.trim()}</li>);
  };

  return (
    <div className="font-sans text-black min-h-screen bg-[#fefbe9] flex flex-col">
      <div className="flex-grow max-w-3xl mx-auto w-full p-6 flex flex-col space-y-6 overflow-y-auto pb-40">

        {/* Game-style Header */}
        <h1 className="text-4xl font-extrabold text-center text-[#212121] border-b-4 border-black pb-2">📖 LLM Questbook</h1>

        {/* Player's Message Bubble */}
        {text && (
          <div className="flex justify-end animate-fade-in">
            <div className="bg-yellow-300 text-black px-4 py-3 rounded-xl max-w-sm border-2 border-black shadow-md font-semibold">
              {text}
            </div>
          </div>
        )}

        {/* AI's Evaluation Report (like Quest Result) */}
        {response && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-full px-5 py-4 bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-[#444]">📜 Evaluation Result</h2>

              <p className="text-2xl font-bold">
                <span className="text-xl font-semibold">Status:</span>{' '}
                <span className={response.status.toLowerCase() === 'fail' ? 'text-red-600' : 'text-green-600'}>
                  {response.status}
                </span>
              </p>

              <p className="text-2xl font-bold">
                <span className="text-xl font-semibold">Score:</span> {response.score}%
              </p>

              {response.feedback && (
                <div>
                  <p className="text-xl font-bold mb-1">💬 Feedback:</p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    {response.feedback
                      .split(/\n|\. /)
                      .filter((line) => line.trim() !== '')
                      .map((line, idx) => (
                        <li key={idx}>{line.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}

              {response.improvementSummary && (
                <div>
                  <p className="text-xl font-bold mb-1">🔧 Improvement Summary:</p>
                  <p className="text-base text-gray-800">{response.improvementSummary}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Bubble */}
        {error && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl max-w-md shadow">
              <p><strong>Error:</strong> {error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chat Input / Command Field */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-[#fefbe9] w-full max-w-3xl mx-auto px-6 pt-2 pb-6 border-t-4 border-black z-10"
      >
        <textarea
          placeholder="Type your message here (Shift+Enter for newline)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          className="w-full p-3 mb-3 border-2 border-black rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none font-mono bg-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              document.getElementById('submit-btn')?.click();
            }
          }}
        />
        <div className="flex justify-end">
          <button
            id="submit-btn"
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-md text-base font-bold shadow transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
            }`}
          >
            {loading ? 'Evaluating...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LLMOutput;