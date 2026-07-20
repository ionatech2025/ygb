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
@Table(name = "iyp_submissions")
@DiscriminatorValue("IYP")
@Getter
@Setter
@NoArgsConstructor
public class IypSubmissionJpaEntity extends SubmissionJpaEntity {
    @Column(name = "aware_of_pdm", nullable = false)
    private Boolean awareOfPdm;

    @Column(name = "eligible_criteria_aware")
    private Boolean eligibleCriteriaAware;

    @Column(name = "applied_for_fund")
    private Boolean appliedForFund;

    @Column(name = "accessed_fund")
    private Boolean accessedFund;

    @Column(name = "rejection_narrative")
    private String rejectionNarrative;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "reasons_for_not_applying")
    private List<String> reasonsForNotApplying;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "information_channels")
    private List<String> informationChannels;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "difficulties_faced")
    private List<String> difficultiesFaced;

    @Column(name = "limitation_explanation")
    private String limitationExplanation;

    @Column(name = "improvement_suggestion", nullable = false)
    private String improvementSuggestion;
}
