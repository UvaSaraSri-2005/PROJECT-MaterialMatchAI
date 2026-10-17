package com.materialmatch.backend.service;

import com.materialmatch.backend.model.LogisticsResult;
import org.springframework.stereotype.Service;

@Service
public class LogisticsService {

    // Example assumptions for estimation
    private static final double COST_PER_KM = 30.0;
    private static final double CO2_PER_KM = 0.8;

    public LogisticsResult calculateLogistics(
            double distanceKm,
            double quantity,
            String unit) {

        double estimatedTransportCost =
                distanceKm * COST_PER_KM;

        double estimatedTransportCo2 =
                distanceKm * CO2_PER_KM;

        return new LogisticsResult(
                distanceKm,
                quantity,
                unit,
                estimatedTransportCost,
                estimatedTransportCo2
        );
    }
}