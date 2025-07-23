import React, { useState } from 'react';
import styles from './VoterDashboard.module.css';

const dummyCandidates = [
  { id: 1, name: 'John Doe', party: 'Party A' },
  { id: 2, name: 'Jane Roe', party: 'Party B' },
];

const VoterDashboard = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleVote = () => {
    if (selectedCandidate !== null) {
      setHasVoted(true);
      alert(`You have voted for ${dummyCandidates.find(c => c.id === selectedCandidate).name}`);
      // In real app: call API to record vote
    } else {
      alert("Please select a candidate to vote.");
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Voter Dashboard</h1>

      <div className={styles.section}>
        <h2>Welcome, Voter!</h2>
        <p>Status: <strong>{hasVoted ? "You have already voted ✅" : "You have not voted yet ❌"}</strong></p>
      </div>

      <div className={styles.section}>
        <h2>Choose Your Candidate</h2>
        <ul className={styles.candidateList}>
          {dummyCandidates.map(candidate => (
            <li key={candidate.id}>
              <label>
                <input
                  type="radio"
                  name="candidate"
                  value={candidate.id}
                  disabled={hasVoted}
                  onChange={() => setSelectedCandidate(candidate.id)}
                />
                {candidate.name} ({candidate.party})
              </label>
            </li>
          ))}
        </ul>

        {!hasVoted && (
          <button onClick={handleVote} className={styles.voteButton}>
            Submit Vote
          </button>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;
