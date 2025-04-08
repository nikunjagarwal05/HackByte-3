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
    <div className="font-sans text-black min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow max-w-3xl mx-auto w-full p-6 flex flex-col space-y-4 overflow-y-auto pb-32">
        <h1 className="text-3xl font-bold text-center mb-4">LLM Output Evaluation</h1>

        {text && (
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-4 py-3 rounded-lg max-w-xs shadow">
              {text}
            </div>
          </div>
        )}
        
        {response && (
          <div className="flex justify-start fade-in">
    <div className="flex flex-col gap-3 border border-gray-300 px-4 py-3 rounded-lg shadow w-full">
      <h2 className="font-semibold text-3xl mb-2">Evaluation Result</h2>
      
      <p className='text-2xl font-bold'>
        <span className="text-xl font-semibold">Status:</span>{' '}
        <span className={response.status.toLowerCase() === 'fail' ? 'text-red-600' : 'text-green-600'}>
          {response.status}
        </span>
      </p>

      <p className='text-2xl font-bold'>
        <span className="text-xl font-semibold">Score:</span> {response.score}%
      </p>

      {response.feedback && (
        <div>
          <p className="text-xl font-bold mb-1">Feedback:</p>
          <ul className="text-base text-gray-800 space-y-1 list-disc ml-6">
            {response.feedback
              .split(/\n|\. /) // split by line or period-space for clarity
              .filter((line) => line.trim() !== '')
              .map((line, idx) => (
                <li key={idx}>{line.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {response.improvementSummary && (
        <div>
          <p className="text-xl font-bold mb-1">Improvement Summary:</p>
          <p className="text-base text-gray-800">{response.improvementSummary}</p>
        </div>
      )}
    </div>
  </div>
)}


        {error && (
          <div className="flex justify-start fade-in">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-md shadow">
              <p><strong>Error:</strong> {error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky input at bottom */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-gray-50 w-full max-w-3xl mx-auto px-6 pt-2 pb-6 flex flex-col border-t border-gray-300"
      >
        <textarea
          placeholder="Type your message here (Shift+Enter for newline)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
            className={`px-6 py-2 text-white rounded-md text-base font-medium transition-colors duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
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