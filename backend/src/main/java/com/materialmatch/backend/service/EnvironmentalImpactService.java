package com.materialmatch.backend.service;

import com.materialmatch.backend.model.EnvironmentalImpactResult;
import org.springframework.stereotype.Service;

@Service
public class EnvironmentalImpactService {

    // Demo assumptions only — replace with documented,
    // material-specific lifecycle emission factors later.
    private static final double VIRGIN_MATERIAL_DISPLACEMENT_FACTOR = 1.0;
    private static final double GROSS_CO2_SAVINGS_PER_KG = 0.5;

    public EnvironmentalImpactResult calculateImpact(
            double reusedMaterialKg,
            double transportCo2EmissionsKg) {

        if (reusedMaterialKg < 0 || transportCo2EmissionsKg < 0) {
            throw new IllegalArgumentException(
                    "Material quantity and transport emissions cannot be negative."
            );
        }

        double virginMaterialDisplacedKg =
                reusedMaterialKg
                        * VIRGIN_MATERIAL_DISPLACEMENT_FACTOR;

        double estimatedGrossCo2SavingsKg =
                reusedMaterialKg
                        * GROSS_CO2_SAVINGS_PER_KG;

        double estimatedNetCo2BenefitKg =
                estimatedGrossCo2SavingsKg
                        - transportCo2EmissionsKg;

        return new EnvironmentalImpactResult(
                reusedMaterialKg,
                virginMaterialDisplacedKg,
                estimatedGrossCo2SavingsKg,
                transportCo2EmissionsKg,
                estimatedNetCo2BenefitKg
        );
    }
}
