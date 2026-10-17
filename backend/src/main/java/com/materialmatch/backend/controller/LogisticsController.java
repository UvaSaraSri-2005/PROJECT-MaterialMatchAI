package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.LogisticsResult;
import com.materialmatch.backend.service.LogisticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logistics")
public class LogisticsController {

    private final LogisticsService logisticsService;

    public LogisticsController(LogisticsService logisticsService) {
        this.logisticsService = logisticsService;
    }

    @GetMapping
    public LogisticsResult calculateLogistics(
            @RequestParam double distanceKm,
            @RequestParam double quantity,
            @RequestParam String unit) {

        return logisticsService.calculateLogistics(
                distanceKm,
                quantity,
                unit
        );
    }
}