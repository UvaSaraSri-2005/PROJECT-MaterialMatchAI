package com.materialmatch.backend.model;

import java.util.List;

public class MultiSupplierMatchResult {

    private String materialName;

    private double requiredQuantity;

    private double totalAvailableQuantity;

    private double remainingQuantity;

    private String unit;

    private List<SupplierContribution> suppliers;

    public MultiSupplierMatchResult() {
    }

    public MultiSupplierMatchResult(String materialName,
                                    double requiredQuantity,
                                    double totalAvailableQuantity,
                                    double remainingQuantity,
                                    String unit,
                                    List<SupplierContribution> suppliers) {

        this.materialName = materialName;
        this.requiredQuantity = requiredQuantity;
        this.totalAvailableQuantity = totalAvailableQuantity;
        this.remainingQuantity = remainingQuantity;
        this.unit = unit;
        this.suppliers = suppliers;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public double getRequiredQuantity() {
        return requiredQuantity;
    }

    public void setRequiredQuantity(double requiredQuantity) {
        this.requiredQuantity = requiredQuantity;
    }

    public double getTotalAvailableQuantity() {
        return totalAvailableQuantity;
    }

    public void setTotalAvailableQuantity(double totalAvailableQuantity) {
        this.totalAvailableQuantity = totalAvailableQuantity;
    }

    public double getRemainingQuantity() {
        return remainingQuantity;
    }

    public void setRemainingQuantity(double remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public List<SupplierContribution> getSuppliers() {
        return suppliers;
    }

    public void setSuppliers(List<SupplierContribution> suppliers) {
        this.suppliers = suppliers;
    }
}