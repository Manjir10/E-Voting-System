package com.evoting.evoting_backend.repository;

import com.evoting.evoting_backend.model.Voter;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface VoterRepository extends CrudRepository<Voter, Long> {
    Optional<Voter> findByVoterId(String voterId);
    
    boolean existsByVoterId(String voterId);

    boolean existsByEmail(String email);
 // src/main/java/com/evoting/evoting_backend/repository/VoterRepository.java
   // Optional<Voter> findByVoterIdIgnoreCase(String voterId);
    Optional<Voter> findByVoterIdIgnoreCase(String voterId);

}
