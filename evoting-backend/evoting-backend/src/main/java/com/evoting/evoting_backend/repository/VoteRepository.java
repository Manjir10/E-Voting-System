package com.evoting.evoting_backend.repository;

import com.evoting.evoting_backend.model.Vote;
import com.evoting.evoting_backend.dto.VoteResultDTO;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface VoteRepository extends CrudRepository<Vote, Long> {

    // ✅ Fetch vote logs by voterId (for audit)
    List<Vote> findAllByVoterId(String voterId);
    void deleteByVoterId(String voterId);

    // ✅ Count votes per candidate (results)
    @Query("SELECT new com.evoting.evoting_backend.dto.VoteResultDTO(v.candidateName, c.party, COUNT(v)) " +
           "FROM Vote v JOIN Candidate c ON v.candidateName = c.name " +
           "GROUP BY v.candidateName, c.party")
    List<VoteResultDTO> countVotesGroupedByCandidate();
}
