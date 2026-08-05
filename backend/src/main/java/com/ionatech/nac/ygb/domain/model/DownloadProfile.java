package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.EmailAddress;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
import com.ionatech.nac.ygb.domain.valueobjects.IsoCountryCode;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class DownloadProfile {
    private final UUID id;
    private final EmailAddress email;
    private final String optionalName;
    private final IsoCountryCode countryCode;
    private final Gender gender;
    private final AgeGroup ageGroup;
    private final FieldOfOperation fieldOfOperation;
    private final String fieldOfOperationSpecify;
    private final boolean consentGiven;
    private final LocalDateTime createdAt;

    private DownloadProfile(
            UUID id,
            EmailAddress email,
            String optionalName,
            IsoCountryCode countryCode,
            Gender gender,
            AgeGroup ageGroup,
            FieldOfOperation fieldOfOperation,
            String fieldOfOperationSpecify,
            boolean consentGiven,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.email = email;
        this.optionalName = optionalName;
        this.countryCode = countryCode;
        this.gender = gender;
        this.ageGroup = ageGroup;
        this.fieldOfOperation = fieldOfOperation;
        this.fieldOfOperationSpecify = fieldOfOperationSpecify;
        this.consentGiven = consentGiven;
        this.createdAt = createdAt;
    }

    public static DownloadProfile recordNew(
            EmailAddress email,
            String optionalName,
            IsoCountryCode countryCode,
            Gender gender,
            AgeGroup ageGroup,
            FieldOfOperation fieldOfOperation,
            String fieldOfOperationSpecify,
            boolean consentGiven,
            LocalDateTime createdAt
    ) {
        Objects.requireNonNull(email, "Email cannot be null");
        Objects.requireNonNull(countryCode, "Country code cannot be null");
        Objects.requireNonNull(gender, "Gender cannot be null");
        Objects.requireNonNull(ageGroup, "Age group cannot be null");
        Objects.requireNonNull(fieldOfOperation, "Field of operation cannot be null");
        Objects.requireNonNull(createdAt, "Created timestamp cannot be null");

        if (!consentGiven) {
            throw new IllegalArgumentException("Consent is required to register a download profile");
        }

        String normalizedName = normalizeOptionalName(optionalName);
        String normalizedSpecify = normalizeSpecify(fieldOfOperation, fieldOfOperationSpecify);

        return new DownloadProfile(
                UUID.randomUUID(),
                email,
                normalizedName,
                countryCode,
                gender,
                ageGroup,
                fieldOfOperation,
                normalizedSpecify,
                true,
                createdAt
        );
    }

    public static DownloadProfile rehydrate(
            UUID id,
            EmailAddress email,
            String optionalName,
            IsoCountryCode countryCode,
            Gender gender,
            AgeGroup ageGroup,
            FieldOfOperation fieldOfOperation,
            String fieldOfOperationSpecify,
            boolean consentGiven,
            LocalDateTime createdAt
    ) {
        return new DownloadProfile(
                id,
                email,
                optionalName,
                countryCode,
                gender,
                ageGroup,
                fieldOfOperation,
                fieldOfOperationSpecify,
                consentGiven,
                createdAt
        );
    }

    private static String normalizeOptionalName(String optionalName) {
        if (optionalName == null || optionalName.isBlank()) {
            return null;
        }
        return optionalName.trim();
    }

    private static String normalizeSpecify(FieldOfOperation fieldOfOperation, String specify) {
        if (fieldOfOperation.requiresSpecify()) {
            if (specify == null || specify.isBlank()) {
                throw new IllegalArgumentException("Please specify field of operation when Other is selected");
            }
            return specify.trim();
        }
        return null;
    }

    public UUID getId() {
        return id;
    }

    public EmailAddress getEmail() {
        return email;
    }

    public String getOptionalName() {
        return optionalName;
    }

    public IsoCountryCode getCountryCode() {
        return countryCode;
    }

    public Gender getGender() {
        return gender;
    }

    public AgeGroup getAgeGroup() {
        return ageGroup;
    }

    public FieldOfOperation getFieldOfOperation() {
        return fieldOfOperation;
    }

    public String getFieldOfOperationSpecify() {
        return fieldOfOperationSpecify;
    }

    public boolean isConsentGiven() {
        return consentGiven;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
