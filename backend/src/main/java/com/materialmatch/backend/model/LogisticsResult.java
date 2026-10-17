package com.materialmatch.backend.model;

public class LogisticsResult {

    private double distanceKm;
    private double quantity;
    private String unit;

    private double estimatedTransportCost;
    private double estimatedTransportCo2;

    public LogisticsResult() {
    }

    public LogisticsResult(double distanceKm,
                           double quantity,
                           String unit,
                           double estimatedTransportCost,
                           double estimatedTransportCo2) {

        this.distanceKm = distanceKm;
        this.quantity = quantity;
        this.unit = unit;
        this.estimatedTransportCost = estimatedTransportCost;
        this.estimatedTransportCo2 = estimatedTransportCo2;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public double getEstimatedTransportCost() {
        return estimatedTransportCost;
    }

    public void setEstimatedTransportCost(double estimatedTransportCost) {
        this.estimatedTransportCost = estimatedTransportCost;
    }

    public double getEstimatedTransportCo2() {
        return estimatedTransportCo2;
    }

    public void setEstimatedTransportCo2(double estimatedTransportCo2) {
        this.estimatedTransportCo2 = estimatedTransportCo2;
    }
}
