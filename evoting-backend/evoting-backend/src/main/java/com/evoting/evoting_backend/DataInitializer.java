package com.evoting.evoting_backend;

import com.evoting.evoting_backend.model.Candidate;
import com.evoting.evoting_backend.repository.CandidateRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CandidateRepository candidateRepository;

    public DataInitializer(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Override
    public void run(String... args) {
        // Only seed when table is empty
        if (candidateRepository.count() == 0) {
            addCandidate("Alice",   "Democratic Party");
            addCandidate("Bob",     "Republican Party");
            addCandidate("Charlie", "Independent");
        } else {
            System.out.println("Candidates already initialized, skipping seeding.");
        }
    }

    private void addCandidate(String name, String party) {
        Candidate candidate = new Candidate(name, party);
        candidateRepository.save(candidate);
        System.out.println("✅ Added candidate: " + name);
    }
}
