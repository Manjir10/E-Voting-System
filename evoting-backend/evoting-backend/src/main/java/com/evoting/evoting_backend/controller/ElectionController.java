package com.evoting.evoting_backend.controller;

import com.evoting.evoting_backend.model.ElectionConfig;
import com.evoting.evoting_backend.repository.ElectionConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/election")
@CrossOrigin(origins = "http://localhost:3000")
public class ElectionController {

    private final ElectionConfigRepository configRepository;

    @Autowired
    public ElectionController(ElectionConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    @GetMapping("/config")
    public Map<String, String> getElectionTime() {
        ElectionConfig config = configRepository.findTopByOrderByIdDesc();

        Map<String, String> response = new HashMap<>();
        if (config != null && config.getStartTime() != null && config.getEndTime() != null) {
            response.put("startTime", config.getStartTime().toString());
            response.put("endTime", config.getEndTime().toString());
        } else {
            response.put("error", "Election period is not configured.");
        }
        return response;
    }

    @PostMapping("/config")
    public ResponseEntity<?> updateElectionTime(
            @RequestBody Map<String, String> request
    ) {
        try {
            String startTimeStr = request.get("startTime");
            String endTimeStr = request.get("endTime");

            // ✅ Parse in IST (Asia/Kolkata)
            LocalDateTime startTime = ZonedDateTime.parse(startTimeStr)
                    .withZoneSameInstant(ZoneId.of("Asia/Kolkata"))
                    .toLocalDateTime();
            LocalDateTime endTime = ZonedDateTime.parse(endTimeStr)
                    .withZoneSameInstant(ZoneId.of("Asia/Kolkata"))
                    .toLocalDateTime();

            ElectionConfig config = new ElectionConfig(1L, startTime, endTime);
            configRepository.save(config);

            return ResponseEntity.ok("Election time updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update election time: " + e.getMessage());
        }
    }
}
