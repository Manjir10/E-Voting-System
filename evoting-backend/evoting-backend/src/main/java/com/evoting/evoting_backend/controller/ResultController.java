package com.evoting.evoting_backend.controller;

import com.evoting.evoting_backend.dto.VoteResultDTO;
import com.evoting.evoting_backend.repository.VoteRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ResultController {

    private final VoteRepository voteRepository;

    public ResultController(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    @GetMapping("/results")
    public List<VoteResultDTO> getAllResults() {
        return voteRepository.countVotesGroupedByCandidate();
    }
}
