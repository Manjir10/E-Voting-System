package com.evoting.evoting_backend.repository;

import com.evoting.evoting_backend.model.Admin;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface AdminRepository extends CrudRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}
