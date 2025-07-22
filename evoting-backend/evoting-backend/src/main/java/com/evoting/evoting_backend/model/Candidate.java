package com.evoting.evoting_backend.model;

import jakarta.persistence.*;

@Entity
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String party;

    // Constructors
    public Candidate() {}

    public Candidate(String name, String party) {
        this.name = name;
        this.party = party;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getParty() { return party; }

    public void setParty(String party) { this.party = party; }
}
