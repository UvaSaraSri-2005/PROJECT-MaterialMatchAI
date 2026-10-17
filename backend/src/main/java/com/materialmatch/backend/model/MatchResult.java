package com.materialmatch.backend.model;

public class MatchResult {

    private String materialName;

    private double availableQuantity;
    private double requiredQuantity;

    private String unit;

    private String location;
    private double distanceKm;

    private int compatibilityScore;

    private String matchReason;

    public MatchResult() {
    }

    public MatchResult(String materialName,
                   double availableQuantity,
                   double requiredQuantity,
                   String unit,
                   String location,
                   double distanceKm,
                   int compatibilityScore,
                   String matchReason) {

        this.materialName = materialName;
        this.availableQuantity = availableQuantity;
        this.requiredQuantity = requiredQuantity;
        this.unit = unit;
        this.location = location;
        this.distanceKm = distanceKm;
        this.compatibilityScore = compatibilityScore;
        this.matchReason = matchReason;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public double getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(double availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public double getRequiredQuantity() {
        return requiredQuantity;
    }

    public void setRequiredQuantity(double requiredQuantity) {
        this.requiredQuantity = requiredQuantity;
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

    public int getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(int compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }
    public double getDistanceKm() {
    return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
    this.distanceKm = distanceKm;
    }
}