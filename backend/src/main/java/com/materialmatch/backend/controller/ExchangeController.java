package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.Exchange;
import com.materialmatch.backend.service.ExchangeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    // Create a new exchange request
    @PostMapping
    public Exchange createExchange(@RequestBody Exchange exchange) {
        return exchangeService.createExchange(exchange);
    }

    // View all exchange requests
    @GetMapping
    public List<Exchange> getAllExchanges() {
        return exchangeService.getAllExchanges();
    }

    // View requests received by a supplier
    @GetMapping("/supplier/{supplierIndustryId}")
    public List<Exchange> getSupplierRequests(
            @PathVariable String supplierIndustryId) {

        return exchangeService.getSupplierRequests(supplierIndustryId);
    }

    // View requests created by a seeker
    @GetMapping("/seeker/{seekerIndustryId}")
    public List<Exchange> getSeekerRequests(
            @PathVariable String seekerIndustryId) {

        return exchangeService.getSeekerRequests(seekerIndustryId);
    }

    // Update an exchange status
    @PatchMapping("/{exchangeId}/status")
    public Exchange updateStatus(
            @PathVariable String exchangeId,
            @RequestParam String status) {

        return exchangeService.updateStatus(exchangeId, status);
    }
}