package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "download_profiles")
public class DownloadProfileJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 320)
    private String email;

    @Column(name = "optional_name", length = 200)
    private String optionalName;

    @Column(name = "country_code", nullable = false, length = 2)
    private String countryCode;

    @Column(nullable = false, length = 16)
    private String gender;

    @Column(name = "age_group", nullable = false, length = 32)
    private String ageGroup;

    @Column(name = "field_of_operation", nullable = false, length = 48)
    private String fieldOfOperation;

    @Column(name = "field_of_operation_specify", length = 255)
    private String fieldOfOperationSpecify;

    @Column(name = "consent_given", nullable = false)
    private boolean consentGiven;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public DownloadProfileJpaEntity() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOptionalName() {
        return optionalName;
    }

    public void setOptionalName(String optionalName) {
        this.optionalName = optionalName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getFieldOfOperation() {
        return fieldOfOperation;
    }

    public void setFieldOfOperation(String fieldOfOperation) {
        this.fieldOfOperation = fieldOfOperation;
    }

    public String getFieldOfOperationSpecify() {
        return fieldOfOperationSpecify;
    }

    public void setFieldOfOperationSpecify(String fieldOfOperationSpecify) {
        this.fieldOfOperationSpecify = fieldOfOperationSpecify;
    }

    public boolean isConsentGiven() {
        return consentGiven;
    }

    public void setConsentGiven(boolean consentGiven) {
        this.consentGiven = consentGiven;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
