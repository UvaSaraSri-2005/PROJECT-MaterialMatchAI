package com.materialmatch.backend.repository;

import com.materialmatch.backend.model.Requirement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RequirementRepository extends MongoRepository<Requirement, String> {
}
