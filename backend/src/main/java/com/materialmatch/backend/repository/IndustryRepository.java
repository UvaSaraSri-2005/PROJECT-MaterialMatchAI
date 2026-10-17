package com.materialmatch.backend.repository;

import com.materialmatch.backend.model.Industry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IndustryRepository extends MongoRepository<Industry, String> {
}

