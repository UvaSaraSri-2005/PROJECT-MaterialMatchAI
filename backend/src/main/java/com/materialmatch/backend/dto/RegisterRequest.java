package com.materialmatch.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank
    @Size(max = 100)
    private String industryName;

    @NotBlank
    @Size(max = 60)
    private String industryType;

    @NotBlank
    @Size(max = 150)
    private String location;

    @NotBlank
    @Size(max = 100)
    private String contactName;

    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank
    @Size(min = 8, max = 72)
    private String password;

    @Size(max = 20)
    private String phone;

    public String getIndustryName() {
        return industryName;
    }

    public String getIndustryType() {
        return industryType;
    }

    public String getLocation() {
        return location;
    }

    public String getContactName() {
        return contactName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }
}

