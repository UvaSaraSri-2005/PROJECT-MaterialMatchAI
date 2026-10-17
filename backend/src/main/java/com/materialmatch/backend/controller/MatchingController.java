package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.MatchResult;
import com.materialmatch.backend.model.Material;
import com.materialmatch.backend.service.MatchingService;
import com.materialmatch.backend.repository.MaterialRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingService matchingService;
    private final MaterialRepository materialRepository;

    public MatchingController(MatchingService matchingService,
                              MaterialRepository materialRepository) {
        this.matchingService = matchingService;
        this.materialRepository = materialRepository;
    }

    @GetMapping("/{materialId}")
    public List<MatchResult> findMatches(@PathVariable String materialId) {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        return matchingService.findMatches(material);
    }
}