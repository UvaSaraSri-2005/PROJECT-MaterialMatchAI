package com.materialmatch.backend.controller;

import com.materialmatch.backend.model.Material;
import com.materialmatch.backend.repository.MaterialRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialRepository materialRepository;

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @PostMapping
    public ResponseEntity<Material> createMaterial(@Valid @RequestBody Material material) {
       Material createdMaterial = materialRepository.save(material);
       return ResponseEntity.status(HttpStatus.CREATED).body(createdMaterial);
    }

    @GetMapping
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    @GetMapping("/{id}")
    public Material getMaterial(@PathVariable String id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Material not found"));
    }
}
