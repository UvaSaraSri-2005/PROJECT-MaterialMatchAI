package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.EnvironmentalImpactResult;
import com.materialmatch.backend.service.EnvironmentalImpactService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/environmental-impact")
public class EnvironmentalImpactController {

    private final EnvironmentalImpactService environmentalImpactService;

    public EnvironmentalImpactController(
            EnvironmentalImpactService environmentalImpactService) {

        this.environmentalImpactService = environmentalImpactService;
    }

    @GetMapping
    public EnvironmentalImpactResult calculateImpact(
            @RequestParam double reusedMaterialKg,
            @RequestParam double transportCo2EmissionsKg) {

        return environmentalImpactService.calculateImpact(
                reusedMaterialKg,
                transportCo2EmissionsKg
        );
    }
}