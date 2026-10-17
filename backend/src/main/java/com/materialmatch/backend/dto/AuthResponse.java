
package com.materialmatch.backend.dto;

public class AuthResponse {

    private final String token;
    private final String userId;
    private final String industryId;
    private final String email;
    private final String industryName;

    public AuthResponse(
            String token,
            String userId,
            String industryId,
            String email,
            String industryName) {
        this.token = token;
        this.userId = userId;
        this.industryId = industryId;
        this.email = email;
        this.industryName = industryName;
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }

    public String getIndustryId() {
        return industryId;
    }

    public String getEmail() {
        return email;
    }

    public String getIndustryName() {
        return industryName;
    }
}


