package com.materialmatch.backend.service;

import com.materialmatch.backend.model.MatchResult;
import com.materialmatch.backend.model.Material;
import com.materialmatch.backend.model.Requirement;
import com.materialmatch.backend.repository.RequirementRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingService {

    private final RequirementRepository requirementRepository;
    private final DistanceService distanceService;

    public MatchingService(RequirementRepository requirementRepository,
                           DistanceService distanceService) {

        this.requirementRepository = requirementRepository;
        this.distanceService = distanceService;
    }

    public List<MatchResult> findMatches(Material material) {

        List<Requirement> requirements = requirementRepository.findAll();

        List<MatchResult> matches = new ArrayList<>();

        for (Requirement requirement : requirements) {

            boolean materialMatches =
                    material.getMaterialName()
                            .equalsIgnoreCase(requirement.getMaterialName());

            boolean categoryMatches =
                    material.getCategory()
                            .equalsIgnoreCase(requirement.getCategory());

            boolean quantityMatches =
                    material.getQuantity() >= requirement.getQuantity();
            Double materialMoisture = material.getMoisture();

            boolean moistureKnown = materialMoisture != null;

            Double maxMoisture = requirement.getMaxMoisture();
            boolean moistureMatches = maxMoisture == null || (moistureKnown && materialMoisture <= maxMoisture);
            
            
            Double materialLatitude = material.getLatitude();
            Double materialLongitude = material.getLongitude();

            Double requirementLatitude = requirement.getLatitude();
            Double requirementLongitude = requirement.getLongitude();

            boolean materialCoordinatesValid =  materialLatitude != null && materialLongitude != null && materialLatitude >= -90 && materialLatitude <= 90 && materialLongitude >= -180 && materialLongitude <= 180 && !(materialLatitude == 0.0 && materialLongitude == 0.0);
            boolean requirementCoordinatesValid = requirementLatitude != null  && requirementLongitude != null  && requirementLatitude >= -90 && requirementLatitude <= 90 && requirementLongitude >= -180 && requirementLongitude <= 180 && !(requirementLatitude == 0.0 && requirementLongitude == 0.0);
            boolean coordinatesValid = materialCoordinatesValid && requirementCoordinatesValid;


            double distance = coordinatesValid
                 ? distanceService.calculateDistance(
                material.getLatitude(),
                material.getLongitude(),
                requirement.getLatitude(),
                requirement.getLongitude()
             )
             : Double.POSITIVE_INFINITY;
             if (!coordinatesValid) {
                continue;
             }


            int score = 0;

            // Material name: 35 points
            if (materialMatches) {
                score += 35;
            }

            // Category: 25 points
            if (categoryMatches) {
                score += 25;
            }

            // Quantity: 20 points
            if (quantityMatches) {
                score += 20;
            }

            // Moisture suitability: 5 points
            if (moistureMatches) {
                score += 5;
            }

            // Distance: maximum 15 points
            if (distance <= 25) {
                score += 15;
            } else if (distance <= 100) {
                score += 10;
            } else if (distance <= 500) {
                score += 5;
            }

            if (score >= 70 && coordinatesValid && distance <= 500 && moistureMatches)   {

               String reason ="Material name, category, quantity, location distance " + "and moisture requirements were considered.";

                MatchResult result = new MatchResult(
        material.getMaterialName(),
        material.getQuantity(),
        requirement.getQuantity(),
        material.getUnit(),
        material.getLocation(),
        distance,
        score,
        reason
        );

                matches.add(result);
            }
        }

        return matches;
    }
}
