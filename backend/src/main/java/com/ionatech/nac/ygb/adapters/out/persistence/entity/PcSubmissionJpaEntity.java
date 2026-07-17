package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "pc_submissions")
@DiscriminatorValue("PC")
@Getter
@Setter
@NoArgsConstructor
public class PcSubmissionJpaEntity extends SubmissionJpaEntity {
    @Column(name = "amount_expected", nullable = false)
    private Long amountExpected;

    @Column(name = "amount_received", nullable = false)
    private Long amountReceived;

    @Column(name = "total_beneficiaries", nullable = false)
    private Integer totalBeneficiaries;

    @Column(name = "youth_beneficiaries", nullable = false)
    private Integer youthBeneficiaries;

    @Column(name = "young_women_beneficiaries", nullable = false)
    private Integer youngWomenBeneficiaries;

    @Column(name = "obstacles_description", nullable = false)
    private String obstaclesDescription;

    @Column(name = "spending_targeted_to_most_in_need", nullable = false)
    private Boolean spendingTargetedToMostInNeed;

    @Column(name = "pdc_total_members", nullable = false)
    private Integer pdcTotalMembers;

    @Column(name = "pdc_youth_members", nullable = false)
    private Integer pdcYouthMembers;

    @Column(name = "pdc_women_members", nullable = false)
    private Integer pdcWomenMembers;

    @Column(name = "pdc_training_received", nullable = false)
    private Boolean pdcTrainingReceived;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "pdc_training_areas")
    private List<String> pdcTrainingAreas;

    @Column(name = "pdc_effectiveness_rating", nullable = false)
    private String pdcEffectivenessRating;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "monitored_by", nullable = false)
    private List<String> monitoredBy;

    @Column(name = "monitored_by_others_specify")
    private String monitoredByOthersSpecify;

    @Column(name = "monitoring_method", nullable = false)
    private String monitoringMethod;

    @Column(name = "report_shared_with_respondent", nullable = false)
    private Boolean reportSharedWithRespondent;

    @Column(name = "improvements_seen", nullable = false)
    private Boolean improvementsSeen;

    @Column(name = "improvements_seen_explanation")
    private String improvementsSeenExplanation;

    @Column(name = "progress_reports_submitted", nullable = false)
    private Boolean progressReportsSubmitted;

    @Column(name = "progress_reports_submitted_explanation")
    private String progressReportsSubmittedExplanation;

    @Column(name = "self_reliance_beneficiaries_count", nullable = false)
    private Integer selfRelianceBeneficiariesCount;

    @Column(name = "self_reliance_group_projects_count", nullable = false)
    private Integer selfRelianceGroupProjectsCount;
}
