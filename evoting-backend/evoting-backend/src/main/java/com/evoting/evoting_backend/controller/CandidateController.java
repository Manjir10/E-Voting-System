package com.evoting.evoting_backend.controller;

import com.evoting.evoting_backend.model.Candidate;
import com.evoting.evoting_backend.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend access
@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    @GetMapping
    public List<Candidate> getAllCandidates() {
        // Convert Iterable to List to avoid type mismatch error
        return StreamSupport
                .stream(candidateRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteCandidate(@PathVariable Long id) {
        candidateRepository.deleteById(id);
    }
}
