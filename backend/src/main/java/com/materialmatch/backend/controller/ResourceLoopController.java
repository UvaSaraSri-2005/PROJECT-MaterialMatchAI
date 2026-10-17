package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.ResourceLoopRecommendation;
import com.materialmatch.backend.service.ResourceLoopService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resource-loop")
public class ResourceLoopController {

    private final ResourceLoopService resourceLoopService;

    public ResourceLoopController(
            ResourceLoopService resourceLoopService) {

        this.resourceLoopService = resourceLoopService;
    }

    @GetMapping
    public List<ResourceLoopRecommendation> getRecommendations(
            @RequestParam String materialName,
            @RequestParam String category) {

        return resourceLoopService.getRecommendations(
                materialName,
                category
        );
    }
}
