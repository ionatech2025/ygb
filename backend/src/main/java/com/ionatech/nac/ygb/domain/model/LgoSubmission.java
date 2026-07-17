package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;
import java.util.UUID;

public class LgoSubmission extends Submission {
    private final List<FiscalYearRecord> fiscalYearRecords;
    private final Boolean fundsSpentAsRequired;
    private final NarrativeText fundsSpentExplanation;
    private final Boolean economicTransformation;
    private final NarrativeText economicTransformationExplanation;
    private final NarrativeText improvementSuggestion;

    public LgoSubmission(
            UUID id,
            SubmissionMetadata metadata,
            Location location,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup,
            List<FiscalYearRecord> fiscalYearRecords,
            Boolean fundsSpentAsRequired,
            NarrativeText fundsSpentExplanation,
            Boolean economicTransformation,
            NarrativeText economicTransformationExplanation,
            NarrativeText improvementSuggestion
    ) {
        super(id, metadata, location, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        
        if (fiscalYearRecords == null || fiscalYearRecords.isEmpty()) {
            throw new IllegalArgumentException("Fiscal year records cannot be null or empty");
        }
        if (fundsSpentAsRequired == null) {
            throw new IllegalArgumentException("Funds spent as required is required");
        }
        if (economicTransformation == null) {
            throw new IllegalArgumentException("Economic transformation is required");
        }
        if (improvementSuggestion == null) {
            throw new IllegalArgumentException("Improvement suggestion is required");
        }

        this.fiscalYearRecords = List.copyOf(fiscalYearRecords);
        this.fundsSpentAsRequired = fundsSpentAsRequired;
        this.fundsSpentExplanation = fundsSpentExplanation;
        this.economicTransformation = economicTransformation;
        this.economicTransformationExplanation = economicTransformationExplanation;
        this.improvementSuggestion = improvementSuggestion;
    }

    public List<FiscalYearRecord> getFiscalYearRecords() {
        return fiscalYearRecords;
    }

    public Boolean getFundsSpentAsRequired() {
        return fundsSpentAsRequired;
    }

    public NarrativeText getFundsSpentExplanation() {
        return fundsSpentExplanation;
    }

    public Boolean getEconomicTransformation() {
        return economicTransformation;
    }

    public NarrativeText getEconomicTransformationExplanation() {
        return economicTransformationExplanation;
    }

    public NarrativeText getImprovementSuggestion() {
        return improvementSuggestion;
    }

    @Override
    public FormType getFormType() {
        return FormType.LGO;
    }

    @Override
    public void validate() {
        if (Boolean.FALSE.equals(fundsSpentAsRequired) && fundsSpentExplanation == null) {
            throw new IllegalArgumentException("Explanation is required when funds were not spent as required");
        }
        if (Boolean.FALSE.equals(economicTransformation) && economicTransformationExplanation == null) {
            throw new IllegalArgumentException("Explanation is required when PDM did not translate into economic transformation");
        }
    }
}
