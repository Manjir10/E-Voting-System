package com.evoting.evoting_backend.dto;

public class VoteResultDTO {
    private String candidateName;
    private String party;
    private long votes;

    // Default constructor (required for frameworks like Jackson)
    public VoteResultDTO() {
    }

    // Parameterized constructor
    public VoteResultDTO(String candidateName, String party, long votes) {
        this.candidateName = candidateName;
        this.party = party;
        this.votes = votes;
    }

    // Getters
    public String getCandidateName() {
        return candidateName;
    }

    public String getParty() {
        return party;
    }

    public long getVotes() {
        return votes;
    }

    // Setters (helpful for deserialization and testing)
    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public void setParty(String party) {
        this.party = party;
    }

    public void setVotes(long votes) {
        this.votes = votes;
    }

    @Override
    public String toString() {
        return "VoteResultDTO{" +
                "candidateName='" + candidateName + '\'' +
                ", party='" + party + '\'' +
                ", votes=" + votes +
                '}';
    }
}
