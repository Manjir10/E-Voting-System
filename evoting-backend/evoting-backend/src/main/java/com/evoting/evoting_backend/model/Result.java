package com.evoting.evoting_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String candidateName;
    private int votes;

    // Constructors
    public Result() {}

    public Result(String candidateName, int votes) {
        this.candidateName = candidateName;
        this.votes = votes;
    }

    // Getters and setters
    // ...
}
