import React, { useState } from 'react';

function LLMOutput() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'black' }}>
      <h1 style={{ textAlign: 'center', color: 'black' }}>LLM Output Evaluation</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          placeholder="Enter text to evaluate"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="5"
          cols="50"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px',
            color: 'black',
          }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007BFF',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Evaluating...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

      {response && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '5px', border: '1px solid #ddd', color: 'black' }}>
          <h2 style={{ color: 'black' }}>Evaluation Result</h2>
          <p><strong>Status:</strong> {response.status}</p>
          <p><strong>Score:</strong> {response.score}%</p>
          <p><strong>Feedback:</strong> {response.feedback}</p>
          {response.improvementSummary && (
            <p><strong>Improvement Summary:</strong> {response.improvementSummary}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LLMOutput;