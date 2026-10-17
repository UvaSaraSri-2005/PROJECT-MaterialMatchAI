
package com.materialmatch.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_accounts")
public class UserAccount {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;
    private String industryId;
    private String role = "INDUSTRY_USER";
    private Instant createdAt = Instant.now();

    public UserAccount() {
    }

    public UserAccount(String email, String passwordHash, String industryId) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.industryId = industryId;
        this.role = "INDUSTRY_USER";
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getIndustryId() {
        return industryId;
    }

    public void setIndustryId(String industryId) {
        this.industryId = industryId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
