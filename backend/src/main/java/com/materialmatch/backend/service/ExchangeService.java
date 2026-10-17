package com.materialmatch.backend.service;

import com.materialmatch.backend.model.Exchange;
import com.materialmatch.backend.repository.ExchangeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;

    public ExchangeService(ExchangeRepository exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }

   
    public Exchange createExchange(Exchange exchange) {

    if (exchange.getRequestedQuantity() <= 0) {
        throw new IllegalArgumentException(
                "Requested quantity must be greater than zero");
    }

    if (exchange.getAgreedPrice() < 0) {
        throw new IllegalArgumentException(
                "Agreed price cannot be negative");
    }

    if (exchange.getMaterialId() == null
            || exchange.getMaterialId().isBlank()) {
        throw new IllegalArgumentException(
                "Material ID is required");
    }

    if (exchange.getSupplierIndustryId() == null
            || exchange.getSupplierIndustryId().isBlank()) {
        throw new IllegalArgumentException(
                "Supplier industry ID is required");
    }

    if (exchange.getSeekerIndustryId() == null
            || exchange.getSeekerIndustryId().isBlank()) {
        throw new IllegalArgumentException(
                "Seeker industry ID is required");
    }

    if (exchange.getUnit() == null || exchange.getUnit().isBlank()) {
        throw new IllegalArgumentException("Unit is required");
    }

    exchange.setStatus("PENDING");
    exchange.setCreatedAt(LocalDateTime.now());
    exchange.setUpdatedAt(LocalDateTime.now());

    return exchangeRepository.save(exchange);
    }

    public List<Exchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }

    public List<Exchange> getSupplierRequests(String supplierIndustryId) {
        return exchangeRepository
                .findBySupplierIndustryId(supplierIndustryId);
    }

    public List<Exchange> getSeekerRequests(String seekerIndustryId) {
        return exchangeRepository
                .findBySeekerIndustryId(seekerIndustryId);
    }

    
    public Exchange updateStatus(String exchangeId, String status) {

         Exchange exchange = exchangeRepository.findById(exchangeId)
            .orElseThrow(() -> new RuntimeException("Exchange not found"));

         String currentStatus = exchange.getStatus();

        if (status == null || status.isBlank()) {
           throw new IllegalArgumentException("Status cannot be empty");
        }

        status = status.trim().toUpperCase();

        boolean validTransition =
            (currentStatus.equals("PENDING")
                    && (status.equals("ACCEPTED") || status.equals("REJECTED")))
            || (currentStatus.equals("ACCEPTED")
                    && status.equals("COMPLETED"));

        if (!validTransition) {
            throw new IllegalArgumentException(
                "Invalid status transition: " + currentStatus + " to " + status);
        }

        exchange.setStatus(status);
        exchange.setUpdatedAt(LocalDateTime.now());

        return exchangeRepository.save(exchange);
    }
}