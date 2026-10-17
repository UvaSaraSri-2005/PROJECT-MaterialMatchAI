package com.materialmatch.backend.repository;

import com.materialmatch.backend.model.Material;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MaterialRepository extends MongoRepository<Material, String> {
}