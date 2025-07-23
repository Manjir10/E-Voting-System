import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [voters, setVoters] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);
  const [results, setResults] = useState([]);
  const [votes, setVotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate();

  // Helper to load voters
  const fetchVoters = () => {
    fetch("http://localhost:8080/api/voters")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setVoters(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading voters:", err));
  };

  useEffect(() => {
    fetchVoters();

    fetch("http://localhost:8080/api/candidates")
      .then(res => res.json())
      .then(data => setCandidatesList(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading candidates:", err));

    fetch("http://localhost:8080/api/votes/results")
      .then(res => res.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading results:", err));

    fetch("http://localhost:8080/api/votes")
      .then(res => res.json())
      .then(data => setVotes(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading votes:", err));

    fetch("http://localhost:8080/api/election/config")
      .then(res => res.json())
      .then(config => {
        if (config.startTime && config.endTime) {
          setStartTime(config.startTime.slice(0, 16));
          setEndTime(config.endTime.slice(0, 16));
        } else {
          console.warn("Election config missing times:", config);
        }
      })
      .catch(err => console.error("Error fetching election time:", err));
  }, []);

  const handleRemoveCandidate = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/candidates/${id}`, {
        method: 'DELETE',
      });
      setCandidatesList(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error removing candidate:", error);
    }
  };

  // ─── UPDATED remove‐voter handler ───────────────────────────────────────────
  const handleRemoveVoter = async (id) => {
    console.log("🔴 Deleting voter id =", id);
    if (!window.confirm("Are you sure you want to delete this voter?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/voters/${id}`, {
        method: 'DELETE',
      });
      const text = await response.text();
      console.log("DELETE /api/voters:", response.status, text);

      if (response.ok) {
        alert("Voter deleted successfully.");
        fetchVoters(); // refresh list
      } else {
        alert("Failed to delete voter: " + text);
      }
    } catch (error) {
      console.error("Error deleting voter:", error);
      alert("Error deleting voter: " + error.message);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const handleUpdateElectionTime = async () => {
    if (!startTime || !endTime) {
      alert("Please fill in both start and end times.");
      return;
    }

    const config = {
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString()
    };

    try {
      const response = await fetch("http://localhost:8080/api/election/config", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const resultText = await response.text();
      if (response.ok) {
        alert("Election time updated successfully.");
      } else {
        alert("Failed to update election time.\n" + resultText);
        console.error("Backend error response:", resultText);
      }
    } catch (err) {
      console.error("Error updating time:", err);
      alert("Error: " + err.message);
    }
  };

  const filteredVoters = voters.filter(voter =>
    voter.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {/* Election Time Configuration */}
      <div className={styles.section}>
        <h2>Set Election Time</h2>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <br />
        <label>End Time:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <br />
        <button onClick={handleUpdateElectionTime} className={styles.button}>
          Save Timeframe
        </button>
      </div>

      {/* View Voters */}
      <div className={styles.section}>
        <h2>View Voters</h2>
        <input
          type="text"
          placeholder="Search voters by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Voter ID</th>
              <th>Has Voted</th>
              <th>Live Photo</th>
              <th>ID Card</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVoters.map(voter => {
              const voterId = voter.voterId || voter.voterIdNumber || "-";
              return (
                <tr key={voter.id}>
                  <td>{voter.id}</td>
                  <td>{voter.name}</td>
                  <td>{voterId}</td>
                  <td>{voter.hasVoted ? '✅' : '❌'}</td>
                  <td>
                    <img
                      src={`http://localhost:8080/api/voters/${voter.id}/photo`}
                      alt="Live"
                      width="60"
                      height="60"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  </td>
                  <td>
                    <img
                      src={`http://localhost:8080/api/voters/${voter.id}/idcard`}
                      alt="ID"
                      width="60"
                      height="60"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  </td>
                  <td>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveVoter(voter.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={styles.viewButton}
                      onClick={() => navigate(`/audit/${voterId}`)}
                      style={{ marginLeft: '8px' }}
                    >
                      View Audit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Results Section */}
      <div className={styles.section}>
        <h2>Results</h2>
        <button
          style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
          onClick={() => navigate("/results")}
        >
          View Detailed Results
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Party</th>
              <th>Votes</th>
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
      </div>

      {/* Registered Candidates Section */}
      <div className={styles.section}>
        <h2>Registered Candidates</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Party</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidatesList.map(candidate => (
              <tr key={candidate.id}>
                <td>{candidate.name}</td>
                <td>{candidate.party}</td>
                <td>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveCandidate(candidate.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vote Logs */}
      <div className={styles.section}>
        <h2>Votes Cast</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Voter ID</th>
              <th>Candidate Name</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, idx) => (
              <tr key={idx}>
                <td>{vote.voterId}</td>
                <td>{vote.candidateName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
