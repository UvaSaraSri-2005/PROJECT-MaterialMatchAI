package com.materialmatch.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "industries")
public class Industry {

    @Id
    private String id;

    private String industryName;
    private String industryType;
    private String location;
    private String contactName;
    private String email;
    private String phone;

    public Industry() {
    }

    public Industry(String industryName, String industryType,
                    String location, String contactName,
                    String email, String phone) {
        this.industryName = industryName;
        this.industryType = industryType;
        this.location = location;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
    }

    public String getId() {
        return id;
    }

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    public String getIndustryType() {
        return industryType;
    }

    public void setIndustryType(String industryType) {
        this.industryType = industryType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
