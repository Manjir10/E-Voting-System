package com.evoting.evoting_backend.controller;

import com.evoting.evoting_backend.dto.VoteResultDTO;
import com.evoting.evoting_backend.model.ElectionConfig;
import com.evoting.evoting_backend.model.Vote;
import com.evoting.evoting_backend.model.Voter;
import com.evoting.evoting_backend.repository.CandidateRepository;
import com.evoting.evoting_backend.repository.ElectionConfigRepository;
import com.evoting.evoting_backend.repository.VoteRepository;
import com.evoting.evoting_backend.repository.VoterRepository;
import com.evoting.evoting_backend.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "http://localhost:3000")
public class VoteController {

    @Autowired private VoteRepository voteRepository;
    @Autowired private VoterRepository voterRepository;
    @Autowired private CandidateRepository candidateRepository;
    @Autowired private ElectionConfigRepository electionConfigRepository;
    @Autowired private EmailService emailService;

    @Transactional
    @PostMapping
    public ResponseEntity<?> castVote(@RequestBody Map<String, Object> payload) {
        // ── Debug #1: raw payload ───────────────────────────────────────────────────
        System.out.println("► RAW PAYLOAD: " + payload);

        // ── Debug #2: dump all voters in DB ────────────────────────────────────────
        System.out.println("► VOTERS IN DB:");
        for (Voter v : voterRepository.findAll()) {
            System.out.println(String.format(
                "   id=%d  voterId='%s'  name='%s'",
                v.getId(), v.getVoterId(), v.getName()
            ));
        }

        // 0) Extract and normalize
        String rawId   = payload.getOrDefault("voterId", "").toString();
        String voterId = rawId.trim();
        String candidateName = payload.getOrDefault("candidateName", "").toString().trim();

        // 1) Election window check
        ElectionConfig cfg = electionConfigRepository.findTopByOrderByIdDesc();
        if (cfg == null) {
            return ResponseEntity.status(403).body("Election period is not configured.");
        }
        ZonedDateTime now   = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        ZonedDateTime start = cfg.getStartTime().atZone(ZoneId.of("Asia/Kolkata"));
        ZonedDateTime end   = cfg.getEndTime().atZone(ZoneId.of("Asia/Kolkata"));
        if (now.isBefore(start) || now.isAfter(end)) {
            return ResponseEntity.status(403)
                                 .body("Voting is not allowed outside the election period.");
        }

        // 2) Lookup voter by voterId (exact, then ignore-case, then DB id)
        Optional<Voter> voterOpt = voterRepository.findByVoterId(voterId);
        if (voterOpt.isEmpty()) {
            System.out.println("No exact match—trying case-insensitive lookup");
            voterOpt = voterRepository.findByVoterIdIgnoreCase(voterId);
        }
        if (voterOpt.isEmpty()) {
            try {
                long dbId = Long.parseLong(voterId);
                System.out.println("No string match—trying DB ID lookup: " + dbId);
                voterOpt = voterRepository.findById(dbId);
            } catch (NumberFormatException ignored) {}
        }
        if (voterOpt.isEmpty()) {
            return ResponseEntity
                   .badRequest()
                   .body("Voter ID not found. Please register first.");
        }
        Voter voter = voterOpt.get();

        // 3) Prevent double voting
        if (voter.isHasVoted()) {
            return ResponseEntity.badRequest().body("You have already voted.");
        }

        // 4) Candidate existence check
        if (!candidateRepository.existsByName(candidateName)) {
            return ResponseEntity.badRequest().body("Candidate not found.");
        }

        // 5) Save vote
        Vote vote = new Vote();
        vote.setVoterId(voter.getVoterId());
        vote.setCandidateName(candidateName);
        voteRepository.save(vote);

        // 6) Mark voter as having voted
        voter.setHasVoted(true);
        voterRepository.save(voter);

        // 7) Send confirmation email (if provided)
        if (voter.getEmail() != null && !voter.getEmail().isBlank()) {
            emailService.sendVoteConfirmation(voter.getEmail(), voter.getName());
        }

        return ResponseEntity.ok("Vote cast successfully for " + candidateName);
    }

    @GetMapping("/audit/{voterId}")
    public ResponseEntity<java.util.List<Vote>> getVoteAuditByVoterId(@PathVariable String voterId) {
        return ResponseEntity.ok(voteRepository.findAllByVoterId(voterId));
    }

    @GetMapping
    public ResponseEntity<java.util.List<Vote>> getAllVotes() {
        return ResponseEntity.ok((java.util.List<Vote>) voteRepository.findAll());
    }

    @GetMapping("/results")
    public ResponseEntity<java.util.List<VoteResultDTO>> getResults() {
        return ResponseEntity.ok(voteRepository.countVotesGroupedByCandidate());
    }
}
