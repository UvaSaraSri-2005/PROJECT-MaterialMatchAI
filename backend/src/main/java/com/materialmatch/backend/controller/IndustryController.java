package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.Industry;
import com.materialmatch.backend.repository.IndustryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/industries")
public class IndustryController {

    private final IndustryRepository industryRepository;

    public IndustryController(IndustryRepository industryRepository) {
        this.industryRepository = industryRepository;
    }

    @PostMapping
    public Industry createIndustry(@RequestBody Industry industry) {
        return industryRepository.save(industry);
    }

    @GetMapping
    public List<Industry> getAllIndustries() {
        return industryRepository.findAll();
    }
}
