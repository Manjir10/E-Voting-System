// src/pages/VotePage.js

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VotePage = () => {
  const location = useLocation();
  // Grab voterId from URL or localStorage
  const urlId    = new URLSearchParams(location.search).get('voterId');
  const storedId = localStorage.getItem('voterId');
  const voterId  = urlId || storedId || '';

  const [candidates, setCandidates]               = useState([]);
  const [selectedCandidateName, setSelectedCandidateName] = useState('');
  const [message, setMessage]                     = useState('');
  const [electionStatus, setElectionStatus]       = useState('');
  const [canVote, setCanVote]                     = useState(false);

  // Load candidates & election window
  useEffect(() => {
    if (!voterId) {
      setMessage('Error: Voter not logged in. Please register first.');
      return;
    }

    axios.get('http://localhost:8080/api/candidates')
      .then(res => setCandidates(res.data))
      .catch(err => console.error('Error fetching candidates:', err));

    axios.get('http://localhost:8080/api/election/config')
      .then(res => {
        const { startTime, endTime } = res.data;
        const now   = new Date();
        const start = new Date(startTime);
        const end   = new Date(endTime);
        if (now < start) {
          setElectionStatus(`Voting starts at ${start.toLocaleString()}`);
        } else if (now <= end) {
          setElectionStatus(`Voting ends at ${end.toLocaleString()}`);
          setCanVote(true);
        } else {
          setElectionStatus('Voting has ended.');
        }
      })
      .catch(err => {
        console.error('Error fetching election config:', err);
        setElectionStatus('Unable to fetch election time.');
      });
  }, [voterId]);

  const handleVote = () => {
    if (!canVote) {
      setMessage('Voting is currently closed.');
      return;
    }
    if (!selectedCandidateName) {
      setMessage('Please select a candidate.');
      return;
    }
    setMessage('');
    submitVote();
  };

  const submitVote = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/votes',
        { voterId, candidateName: selectedCandidateName }
      );
      setMessage(res.data);
    } catch (err) {
      console.error('Vote error:', err);
      setMessage('Error submitting vote: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🗳️ Cast Your Vote</h2>
      <p style={{ fontWeight: 'bold', color: canVote ? 'green' : 'orange' }}>
        {electionStatus}
      </p>

      <select
        value={selectedCandidateName}
        onChange={e => setSelectedCandidateName(e.target.value)}
      >
        <option value="">-- Select Candidate --</option>
        {candidates.map(c => (
          <option key={c.id} value={c.name}>
            {c.name} ({c.party})
          </option>
        ))}
      </select>

      <br /><br />

      <button
        onClick={handleVote}
        disabled={!canVote}
        style={{
          backgroundColor: canVote ? 'green' : 'gray',
          color: 'white',
          padding: '10px'
        }}
      >
        Submit Vote
      </button>

      {message && (
        <p
          style={{
            marginTop: '1rem',
            color: message.startsWith('Error') ? 'red' : 'green'
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default VotePage;
