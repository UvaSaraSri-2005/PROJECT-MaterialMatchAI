package com.materialmatch.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "exchanges")
public class Exchange {

    @Id
    private String id;

    private String materialId;
    private String supplierIndustryId;
    private String seekerIndustryId;

    private double requestedQuantity;
    private String unit;

    private double agreedPrice;

    private String status;

    private String message;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Exchange() {
    }

    public Exchange(
            String materialId,
            String supplierIndustryId,
            String seekerIndustryId,
            double requestedQuantity,
            String unit,
            double agreedPrice,
            String status,
            String message) {

        this.materialId = materialId;
        this.supplierIndustryId = supplierIndustryId;
        this.seekerIndustryId = seekerIndustryId;
        this.requestedQuantity = requestedQuantity;
        this.unit = unit;
        this.agreedPrice = agreedPrice;
        this.status = status;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getMaterialId() {
        return materialId;
    }

    public void setMaterialId(String materialId) {
        this.materialId = materialId;
    }

    public String getSupplierIndustryId() {
        return supplierIndustryId;
    }

    public void setSupplierIndustryId(String supplierIndustryId) {
        this.supplierIndustryId = supplierIndustryId;
    }

    public String getSeekerIndustryId() {
        return seekerIndustryId;
    }

    public void setSeekerIndustryId(String seekerIndustryId) {
        this.seekerIndustryId = seekerIndustryId;
    }

    public double getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(double requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public double getAgreedPrice() {
        return agreedPrice;
    }

    public void setAgreedPrice(double agreedPrice) {
        this.agreedPrice = agreedPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
