package com.evoting.evoting_backend.controller;

import com.evoting.evoting_backend.model.Voter;
import com.evoting.evoting_backend.service.VoterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/voters")
@CrossOrigin(origins = "http://localhost:3000")
public class VoterController {

    @Autowired
    private VoterService voterService;

    @PostMapping("/register")
    public ResponseEntity<String> registerVoter(
            @RequestParam("name") String name,
            @RequestParam("dob") String dob,
            @RequestParam("gender") String gender,
            @RequestParam("address") String address,
            @RequestParam("email") String email,
            @RequestParam("voterId") String voterId,
            @RequestParam("password") String password,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("voterIdCard") MultipartFile voterIdCard
    ) {
        Voter voter = new Voter();
        voter.setName(name);
        voter.setDob(LocalDate.parse(dob));
        voter.setGender(gender);
        voter.setAddress(address);
        voter.setEmail(email);
        voter.setVoterId(voterId);
        voter.setPassword(password);

        String result = voterService.registerVoter(voter, photo, voterIdCard);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<Voter>> getAllVoters() {
        List<Voter> list = voterService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voter> getVoterById(@PathVariable Long id) {
        Optional<Voter> voterOpt = voterService.findById(id);
        return voterOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getVoterPhoto(@PathVariable Long id) {
        Optional<Voter> v = voterService.findById(id);
        if (v.isEmpty() || v.get().getPhoto() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .body(v.get().getPhoto());
    }

    @GetMapping("/{id}/idcard")
    public ResponseEntity<byte[]> getVoterIdCard(@PathVariable Long id) {
        Optional<Voter> v = voterService.findById(id);
        if (v.isEmpty() || v.get().getVoterIdCard() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .body(v.get().getVoterIdCard());
    }
    // ─── NEW DELETE ENDPOINT ────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVoter(@PathVariable Long id) {
        try {
            voterService.deleteVoterById(id);
            return ResponseEntity.ok("Voter deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete voter: " + e.getMessage());
        }
    }
}
