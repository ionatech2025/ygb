package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "submissions")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "form_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
public abstract class SubmissionJpaEntity {
    @Id
    private UUID id;

    @Column(name = "collector_id", nullable = false)
    private UUID collectorId;

    @Column(name = "device_submission_id", nullable = false, unique = true)
    private UUID deviceSubmissionId;

    @Column(name = "form_completed_at", nullable = false)
    private LocalDateTime formCompletedAt;

    @Column(name = "financial_year_period", nullable = false)
    private String financialYearPeriod;

    @Column(nullable = false)
    private String status;

    @Column(name = "district_id", nullable = false)
    private UUID districtId;

    @Column(name = "subcounty_id", nullable = false)
    private UUID subcountyId;

    @Column(name = "parish_id", nullable = false)
    private UUID parishId;

    @Column(name = "village_id", nullable = false)
    private UUID villageId;

    @Column(name = "respondent_name", nullable = false)
    private String respondentName;

    @Column(name = "respondent_phone", nullable = false)
    private String respondentPhone;

    @Column(name = "respondent_gender", nullable = false)
    private String respondentGender;

    @Column(name = "respondent_age_group", nullable = false)
    private String respondentAgeGroup;

    @Column(name = "form_type", insertable = false, updatable = false)
    private String formType;
}
