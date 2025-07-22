package com.evoting.evoting_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String voterId;
    private String candidateName;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime timestamp;

    public Vote() {}

    public Vote(String voterId, String candidateName) {
        this.voterId = voterId;
        this.candidateName = candidateName;
    }

    public Long getId() {
        return id;
    }

    public String getVoterId() {
        return voterId;
    }

    public void setVoterId(String voterId) {
        this.voterId = voterId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
