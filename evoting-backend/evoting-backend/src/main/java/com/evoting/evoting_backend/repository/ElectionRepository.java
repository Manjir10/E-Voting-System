package com.evoting.evoting_backend.repository;

import com.evoting.evoting_backend.model.Election;
import org.springframework.data.repository.CrudRepository;

public interface ElectionRepository extends CrudRepository<Election, Long> {
    Election findTopByOrderByIdDesc(); // Get latest election timeframe
}
