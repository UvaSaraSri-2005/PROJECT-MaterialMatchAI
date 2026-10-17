package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.MultiSupplierMatchResult;
import com.materialmatch.backend.service.MultiSupplierMatchingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/multi-matching")
public class MultiSupplierMatchingController {

    private final MultiSupplierMatchingService multiSupplierMatchingService;

    public MultiSupplierMatchingController(
            MultiSupplierMatchingService multiSupplierMatchingService) {

        this.multiSupplierMatchingService =
                multiSupplierMatchingService;
    }

    @GetMapping("/{requirementId}")
    public MultiSupplierMatchResult findSuppliers(
            @PathVariable String requirementId) {

        return multiSupplierMatchingService
                .findSuppliers(requirementId);
    }
}