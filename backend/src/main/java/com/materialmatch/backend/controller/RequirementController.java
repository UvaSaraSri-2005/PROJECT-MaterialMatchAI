package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.Requirement;
import com.materialmatch.backend.repository.RequirementRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

    private final RequirementRepository requirementRepository;

    public RequirementController(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

   
    @PostMapping
    public ResponseEntity<Requirement> createRequirement(@Valid @RequestBody Requirement requirement) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requirementRepository.save(requirement));
    }


    @GetMapping
    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    @GetMapping("/{id}")
    public Requirement getRequirement(@PathVariable String id) {
        return requirementRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Requirement not found"));
    }
}
