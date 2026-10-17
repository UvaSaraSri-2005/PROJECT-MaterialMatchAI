package com.materialmatch.backend.model;

public class ResourceLoopRecommendation {

    private String materialName;
    private String recommendedUse;
    private String targetIndustry;
    private String reason;
    private String processingRequired;
    private String suitability;
    private String safetyNote;

    public ResourceLoopRecommendation() {
    }

    public ResourceLoopRecommendation(
            String materialName,
            String recommendedUse,
            String targetIndustry,
            String reason,
            String processingRequired,
            String suitability,
            String safetyNote) {

        this.materialName = materialName;
        this.recommendedUse = recommendedUse;
        this.targetIndustry = targetIndustry;
        this.reason = reason;
        this.processingRequired = processingRequired;
        this.suitability = suitability;
        this.safetyNote = safetyNote;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getRecommendedUse() {
        return recommendedUse;
    }

    public void setRecommendedUse(String recommendedUse) {
        this.recommendedUse = recommendedUse;
    }

    public String getTargetIndustry() {
        return targetIndustry;
    }

    public void setTargetIndustry(String targetIndustry) {
        this.targetIndustry = targetIndustry;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getProcessingRequired() {
        return processingRequired;
    }

    public void setProcessingRequired(String processingRequired) {
        this.processingRequired = processingRequired;
    }

    public String getSuitability() {
        return suitability;
    }

    public void setSuitability(String suitability) {
        this.suitability = suitability;
    }

    public String getSafetyNote() {
        return safetyNote;
    }

    public void setSafetyNote(String safetyNote) {
        this.safetyNote = safetyNote;
    }
}