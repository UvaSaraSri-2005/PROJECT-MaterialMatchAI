package com.materialmatch.backend.model;

public class EnvironmentalImpactResult {

    private double materialDivertedKg;
    private double virginMaterialDisplacedKg;

    private double estimatedGrossCo2SavingsKg;
    private double transportCo2EmissionsKg;
    private double estimatedNetCo2BenefitKg;

    public EnvironmentalImpactResult() {
    }

    public EnvironmentalImpactResult(
            double materialDivertedKg,
            double virginMaterialDisplacedKg,
            double estimatedGrossCo2SavingsKg,
            double transportCo2EmissionsKg,
            double estimatedNetCo2BenefitKg) {

        this.materialDivertedKg = materialDivertedKg;
        this.virginMaterialDisplacedKg = virginMaterialDisplacedKg;
        this.estimatedGrossCo2SavingsKg = estimatedGrossCo2SavingsKg;
        this.transportCo2EmissionsKg = transportCo2EmissionsKg;
        this.estimatedNetCo2BenefitKg = estimatedNetCo2BenefitKg;
    }

    public double getMaterialDivertedKg() {
        return materialDivertedKg;
    }

    public void setMaterialDivertedKg(double materialDivertedKg) {
        this.materialDivertedKg = materialDivertedKg;
    }

    public double getVirginMaterialDisplacedKg() {
        return virginMaterialDisplacedKg;
    }

    public void setVirginMaterialDisplacedKg(double virginMaterialDisplacedKg) {
        this.virginMaterialDisplacedKg = virginMaterialDisplacedKg;
    }

    public double getEstimatedGrossCo2SavingsKg() {
        return estimatedGrossCo2SavingsKg;
    }

    public void setEstimatedGrossCo2SavingsKg(
            double estimatedGrossCo2SavingsKg) {
        this.estimatedGrossCo2SavingsKg = estimatedGrossCo2SavingsKg;
    }

    public double getTransportCo2EmissionsKg() {
        return transportCo2EmissionsKg;
    }

    public void setTransportCo2EmissionsKg(
            double transportCo2EmissionsKg) {
        this.transportCo2EmissionsKg = transportCo2EmissionsKg;
    }

    public double getEstimatedNetCo2BenefitKg() {
        return estimatedNetCo2BenefitKg;
    }

    public void setEstimatedNetCo2BenefitKg(
            double estimatedNetCo2BenefitKg) {
        this.estimatedNetCo2BenefitKg = estimatedNetCo2BenefitKg;
    }
}