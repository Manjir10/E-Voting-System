// src/pages/ResultsPage.js
import React, { useEffect, useState } from 'react';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/results')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setError("Unexpected result format from server");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching results:", err);
        setError("Failed to load results. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🗳️ Voting Results</h2>

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && results.length === 0 && <p>No results available yet.</p>}

      {!loading && !error && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Party</th>
              <th>Total Votes</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx}>
                <td>{result.candidateName}</td>
                <td>{result.party}</td>
                <td>{result.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsPage;
