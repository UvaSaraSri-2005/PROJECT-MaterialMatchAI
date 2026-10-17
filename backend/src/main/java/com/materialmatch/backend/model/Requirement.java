package com.materialmatch.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "requirements")
public class Requirement {

    @Id
    private String id;

    @NotBlank(message = "Industry ID is required")
    private String industryId;

    @NotBlank(message = "Material name is required")
    private String materialName;
    @NotBlank(message = "Material category is required")
    private String category;

    @DecimalMin(value = "0.0", inclusive = false, message = "Required quantity must be greater than zero")
    private double quantity;
    @NotBlank(message = "Unit is required")
    private String unit;

    private String location;
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;
    @DecimalMin(value = "0.0", message = "Maximum moisture must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Maximum moisture must be between 0 and 100")
    private Double maxMoisture;

    private String description;

    public Requirement() {
    }

    public Requirement(String industryId,
                       String materialName,
                       String category,
                       double quantity,
                       String unit,
                       String location,
                       String description) {

        this.industryId = industryId;
        this.materialName = materialName;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.location = location;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public String getIndustryId() {
        return industryId;
    }

    public void setIndustryId(String industryId) {
        this.industryId = industryId;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
     public Double getLatitude() {
    return latitude;
    }

    public void setLatitude(Double latitude) {
    this.latitude = latitude;
    }

    public Double getLongitude() {
    return longitude;
    }

    public void setLongitude(Double longitude) {
    this.longitude = longitude;
    }
    public Double getMaxMoisture() {
    return maxMoisture;
    }

    public void setMaxMoisture(Double maxMoisture) {
    this.maxMoisture = maxMoisture;
    }
}
