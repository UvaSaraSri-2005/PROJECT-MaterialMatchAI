package com.materialmatch.backend.repository;

import com.materialmatch.backend.model.Exchange;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExchangeRepository
        extends MongoRepository<Exchange, String> {

    List<Exchange> findBySupplierIndustryId(String supplierIndustryId);

    List<Exchange> findBySeekerIndustryId(String seekerIndustryId);

    List<Exchange> findByStatus(String status);
}
