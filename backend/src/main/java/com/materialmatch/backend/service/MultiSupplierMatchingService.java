
package com.materialmatch.backend.service;

import com.materialmatch.backend.model.LogisticsResult;
import com.materialmatch.backend.model.Material;
import com.materialmatch.backend.model.MultiSupplierMatchResult;
import com.materialmatch.backend.model.Requirement;
import com.materialmatch.backend.model.SupplierContribution;
import com.materialmatch.backend.repository.MaterialRepository;
import com.materialmatch.backend.repository.RequirementRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MultiSupplierMatchingService {

    private final MaterialRepository materialRepository;
    private final RequirementRepository requirementRepository;
    private final DistanceService distanceService;
    private final LogisticsService logisticsService;

    public MultiSupplierMatchingService(
            MaterialRepository materialRepository,
            RequirementRepository requirementRepository,
            DistanceService distanceService,
            LogisticsService logisticsService) {

        this.materialRepository = materialRepository;
        this.requirementRepository = requirementRepository;
        this.distanceService = distanceService;
        this.logisticsService = logisticsService;
    }

    public MultiSupplierMatchResult findSuppliers(String requirementId) {

        Requirement requirement = requirementRepository
                .findById(requirementId)
                .orElseThrow(() ->
                        new RuntimeException("Requirement not found"));

        List<Material> materials = materialRepository.findAll();

        List<SupplierContribution> suppliers = new ArrayList<>();

        double totalAvailableQuantity = 0;

        for (Material material : materials) {

            // Check material name
            boolean materialMatches =
                    material.getMaterialName() != null
                    && requirement.getMaterialName() != null
                    && material.getMaterialName()
                            .equalsIgnoreCase(requirement.getMaterialName());

            // Check material category
            boolean categoryMatches =
                    material.getCategory() != null
                    && requirement.getCategory() != null
                    && material.getCategory()
                            .equalsIgnoreCase(requirement.getCategory());

            // Check available quantity
            boolean quantityAvailable =
                    material.getQuantity() > 0;

            // Check moisture requirements
            Double materialMoisture = material.getMoisture();

            boolean moistureKnown = materialMoisture != null;

            Double maxMoisture = requirement.getMaxMoisture();
            boolean moistureMatches = maxMoisture == null
                    || (moistureKnown && materialMoisture <= maxMoisture);

            // Read coordinates
            Double materialLatitude = material.getLatitude();
            Double materialLongitude = material.getLongitude();

            Double requirementLatitude = requirement.getLatitude();
            Double requirementLongitude = requirement.getLongitude();

            // Validate material coordinates
            boolean materialCoordinatesValid =
                    materialLatitude != null
                    && materialLongitude != null
                    && materialLatitude >= -90
                    && materialLatitude <= 90
                    && materialLongitude >= -180
                    && materialLongitude <= 180
                    && !(materialLatitude == 0.0
                    && materialLongitude == 0.0);

            // Validate requirement coordinates
            boolean requirementCoordinatesValid =
                    requirementLatitude != null
                    && requirementLongitude != null
                    && requirementLatitude >= -90
                    && requirementLatitude <= 90
                    && requirementLongitude >= -180
                    && requirementLongitude <= 180
                    && !(requirementLatitude == 0.0
                    && requirementLongitude == 0.0);

            boolean coordinatesValid =
                    materialCoordinatesValid
                    && requirementCoordinatesValid;

            // Calculate distance only for valid coordinates
            double distance = coordinatesValid
                    ? distanceService.calculateDistance(
                            materialLatitude,
                            materialLongitude,
                            requirementLatitude,
                            requirementLongitude
                    )
                    : Double.POSITIVE_INFINITY;

            boolean unitMatches = material.getUnit() != null && material.getUnit().equalsIgnoreCase(requirement.getUnit());
            boolean distanceMatches =
                    coordinatesValid && distance <= 500;

            // Include only eligible suppliers
            if (materialMatches
                    && categoryMatches
                    && unitMatches
                    && quantityAvailable
                    && distanceMatches
                    && moistureMatches) {

                double remainingRequirement =
                        requirement.getQuantity()
                        - totalAvailableQuantity;

                if (remainingRequirement <= 0) {
                    break;
                }

                double contribution = Math.min(
                        material.getQuantity(),
                        remainingRequirement
                );

                // Calculate estimated logistics
                LogisticsResult logistics =
                        logisticsService.calculateLogistics(
                                distance,
                                contribution,
                                material.getUnit()
                        );

                SupplierContribution supplier =
                        new SupplierContribution(
                                material.getId(),
                                material.getIndustryId(),
                                material.getQuantity(),
                                contribution,
                                material.getUnit(),
                                material.getLocation(),
                                distance,
                                logistics.getEstimatedTransportCost(),
                                logistics.getEstimatedTransportCo2()
                        );

                suppliers.add(supplier);

                totalAvailableQuantity += contribution;
            }
        }

        double remainingQuantity = Math.max(
                0,
                requirement.getQuantity() - totalAvailableQuantity
        );

        return new MultiSupplierMatchResult(
                requirement.getMaterialName(),
                requirement.getQuantity(),
                totalAvailableQuantity,
                remainingQuantity,
                requirement.getUnit(),
                suppliers
        );
    }
}
