package com.evoting.evoting_backend.service;

import com.evoting.evoting_backend.model.Voter;
import com.evoting.evoting_backend.repository.VoteRepository;
import com.evoting.evoting_backend.repository.VoterRepository;
import com.evoting.evoting_backend.utils.MultipartInputStreamFileResource;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class VoterService {

    @Autowired
    private VoterRepository voterRepository;
   //@Autowired private VoterRepository voterRepository;
    @Autowired private VoteRepository voteRepository;

    public String registerVoter(Voter voter, MultipartFile photo, MultipartFile voterIdCard) {
        System.out.println("---- registerVoter() called ----");

        try {
            // duplicate check
            if (voterRepository.existsByVoterId(voter.getVoterId()) ||
                voterRepository.existsByEmail(voter.getEmail())) {
                return "Voter with this ID or Email already exists.";
            }

            // build multipart to Flask (or other face-auth service)
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("photo", new MultipartInputStreamFileResource(
                  photo.getInputStream(), photo.getOriginalFilename()));
            body.add("voterIdCard", new MultipartInputStreamFileResource(
                  voterIdCard.getInputStream(), voterIdCard.getOriginalFilename()));
            body.add("name", voter.getName());
            body.add("dob", voter.getDob().toString());
            body.add("voterId", voter.getVoterId());

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            String flaskUrl = "http://localhost:5001/verify-face";

            System.out.println("Calling face-auth API...");
            ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, request, String.class);
            System.out.println("Face-auth Response: " + response.getBody());

            // parse JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.getBody());
            if (!jsonNode.has("result") ||
                !"match".equalsIgnoreCase(jsonNode.get("result").asText())) {
                String reason = jsonNode.has("reason") ? jsonNode.get("reason").asText()
                                                      : "invalid response";
                return "Face authentication failed: " + reason;
            }

            // save on success
            voter.setPhoto(photo.getBytes());
            voter.setVoterIdCard(voterIdCard.getBytes());
            voterRepository.save(voter);
            return "Voter registered successfully.";

        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to save voter: " + e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error during face authentication: " + e.getMessage();
        }
    }

    // Add this method so that Controller can call voterService.findAll()
    public List<Voter> findAll() {
        List<Voter> list = new ArrayList<>();
        voterRepository.findAll().forEach(list::add);
        return list;
    }

    public Optional<Voter> findById(Long id) {
        return voterRepository.findById(id);
    }

    //public void deleteVoterById(Long id) {
    //    voterRepository.deleteById(id);
    //}
    public Optional<Voter> findByVoterId(String voterId) {
        return voterRepository.findByVoterId(voterId);
    }
    @Transactional
    public void deleteVoterById(Long id) {
        Voter v = voterRepository.findById(id)
                     .orElseThrow(() -> new IllegalArgumentException("No voter with id " + id));
        // 1) delete all their votes
        voteRepository.deleteByVoterId(v.getVoterId());
        // 2) delete the voter record
        voterRepository.deleteById(id);
    }
    
}
