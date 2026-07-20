package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.Location;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionMetadata;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;

import java.util.UUID;

public abstract class Submission {
    private final UUID id;
    private final SubmissionMetadata metadata;
    private final Location location;
    private final String respondentName;
    private final String respondentPhone;
    private final String respondentGender;
    private final AgeGroup respondentAgeGroup;
    private SubmissionStatus status;

    protected Submission(
            UUID id,
            SubmissionMetadata metadata,
            Location location,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup
    ) {
        if (id == null) {
            throw new IllegalArgumentException("Submission ID cannot be null");
        }
        if (metadata == null) {
            throw new IllegalArgumentException("Metadata cannot be null");
        }
        if (location == null) {
            throw new IllegalArgumentException("Location cannot be null");
        }
        if (respondentName == null || respondentName.trim().isEmpty()) {
            throw new IllegalArgumentException("Respondent name cannot be null or blank");
        }
        if (respondentPhone == null || respondentPhone.trim().isEmpty()) {
            throw new IllegalArgumentException("Respondent phone cannot be null or blank");
        }
        if (respondentGender == null || respondentGender.trim().isEmpty()) {
            throw new IllegalArgumentException("Respondent gender cannot be null or blank");
        }
        if (respondentAgeGroup == null) {
            throw new IllegalArgumentException("Respondent age group cannot be null");
        }

        this.id = id;
        this.metadata = metadata;
        this.location = location;
        this.respondentName = respondentName;
        this.respondentPhone = respondentPhone;
        this.respondentGender = respondentGender;
        this.respondentAgeGroup = respondentAgeGroup;
        this.status = SubmissionStatus.PENDING;
    }

    public UUID getId() {
        return id;
    }

    public SubmissionMetadata getMetadata() {
        return metadata;
    }

    public Location getLocation() {
        return location;
    }

    public String getRespondentName() {
        return respondentName;
    }

    public String getRespondentPhone() {
        return respondentPhone;
    }

    public String getRespondentGender() {
        return respondentGender;
    }

    public AgeGroup getRespondentAgeGroup() {
        return respondentAgeGroup;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        this.status = status;
    }

    public abstract FormType getFormType();

    public abstract void validate();
}
