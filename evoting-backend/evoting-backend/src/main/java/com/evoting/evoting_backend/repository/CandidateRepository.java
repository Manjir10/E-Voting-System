package com.evoting.evoting_backend.repository;

import com.evoting.evoting_backend.model.Candidate;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CandidateRepository extends CrudRepository<Candidate, Long> {
    Optional<Candidate> findByName(String name);
    boolean existsByName(String name);

}
