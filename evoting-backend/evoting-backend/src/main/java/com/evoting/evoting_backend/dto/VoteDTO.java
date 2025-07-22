package com.evoting.evoting_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VoteDTO {
    @JsonProperty("voterId")
    private String voterId;

    @JsonProperty("candidateName")
    private String candidateName;

    // getters & setters
    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
}
