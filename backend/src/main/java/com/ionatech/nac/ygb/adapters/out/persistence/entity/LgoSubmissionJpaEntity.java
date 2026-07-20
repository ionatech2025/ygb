package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;
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
@Table(name = "lgo_submissions")
@DiscriminatorValue("LGO")
@Getter
@Setter
@NoArgsConstructor
public class LgoSubmissionJpaEntity extends SubmissionJpaEntity {
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "fiscal_year_records", nullable = false)
    private List<FiscalYearRecord> fiscalYearRecords;

    @Column(name = "funds_allocated_equitably", nullable = false)
    private Boolean fundsAllocatedEquitably;

    @Column(name = "allocated_funds_sufficient", nullable = false)
    private Boolean allocatedFundsSufficient;

    @Column(name = "adequate_utilisation_oversight", nullable = false)
    private Boolean adequateUtilisationOversight;

    @Column(name = "transparent_beneficiary_selection", nullable = false)
    private Boolean transparentBeneficiarySelection;

    @Column(name = "funds_spent_as_required", nullable = false)
    private Boolean fundsSpentAsRequired;

    @Column(name = "funds_spent_explanation")
    private String fundsSpentExplanation;

    @Column(name = "economic_transformation", nullable = false)
    private Boolean economicTransformation;

    @Column(name = "economic_transformation_explanation")
    private String economicTransformationExplanation;

    @Column(name = "improvement_suggestion", nullable = false)
    private String improvementSuggestion;
}
