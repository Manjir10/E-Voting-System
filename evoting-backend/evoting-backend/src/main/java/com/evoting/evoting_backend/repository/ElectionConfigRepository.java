package com.evoting.evoting_backend.repository;

import com.evoting.evoting_backend.model.ElectionConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElectionConfigRepository extends JpaRepository<ElectionConfig, Long> {

    // ✅ This fetches the latest election config by ID (assumes highest ID = latest)
    ElectionConfig findTopByOrderByIdDesc();
}
