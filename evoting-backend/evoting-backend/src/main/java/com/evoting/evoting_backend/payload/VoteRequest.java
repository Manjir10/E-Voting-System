package com.evoting.evoting_backend.payload;

import java.time.LocalDateTime;

public class VoteRequest {
    private Long voterId;
    private Long candidateId;
    private LocalDateTime timestamp; // You can also use java.util.Date if needed

    // Default constructor
    public VoteRequest() {}

    // Getters and setters
    public Long getVoterId() {
        return voterId;
    }

    public void setVoterId(Long voterId) {
        this.voterId = voterId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
