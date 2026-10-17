package com.materialmatch.backend.model;

public class SupplierContribution {

    private String materialId;
    private String industryId;
    private double availableQuantity;
    private double contributedQuantity;
    private String unit;
    private String location;
    private double distanceKm;
    private double estimatedTransportCost;
    private double estimatedTransportCo2;

    public SupplierContribution() {
    }

    public SupplierContribution(String materialId,
                            String industryId,
                            double availableQuantity,
                            double contributedQuantity,
                            String unit,
                            String location,
                            double distanceKm,
                            double estimatedTransportCost,
                            double estimatedTransportCo2) {

        this.materialId = materialId;
        this.industryId = industryId;
        this.availableQuantity = availableQuantity;
        this.contributedQuantity = contributedQuantity;
        this.unit = unit;
        this.location = location;
        this.distanceKm = distanceKm;
        this.estimatedTransportCost = estimatedTransportCost;
        this.estimatedTransportCo2 = estimatedTransportCo2;
    }

    public String getMaterialId() {
        return materialId;
    }

    public void setMaterialId(String materialId) {
        this.materialId = materialId;
    }

    public String getIndustryId() {
        return industryId;
    }

    public void setIndustryId(String industryId) {
        this.industryId = industryId;
    }

    public double getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(double availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public double getContributedQuantity() {
        return contributedQuantity;
    }

    public void setContributedQuantity(double contributedQuantity) {
        this.contributedQuantity = contributedQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
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
