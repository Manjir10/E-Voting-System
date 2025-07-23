import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AuditLog = () => {
  const { voterId } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/votes/audit/${voterId}`)
      .then((res) => res.json())
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Audit fetch failed:", err));
  }, [voterId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📝 Vote Audit Log for Voter ID: {voterId}</h2>
      <table border="1" cellPadding={10}>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.candidateName}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;
