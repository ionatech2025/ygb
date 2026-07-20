package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class LgoSubmissionRequestDto extends SubmissionRequestDto {
    private List<FiscalYearRecord> fiscalYearRecords;
    private Boolean fundsAllocatedEquitably;
    private Boolean allocatedFundsSufficient;
    private Boolean adequateUtilisationOversight;
    private Boolean transparentBeneficiarySelection;
    private Boolean fundsSpentAsRequired;
    private String fundsSpentExplanation;
    private Boolean economicTransformation;
    private String economicTransformationExplanation;
    private String improvementSuggestion;

    public LgoSubmissionRequestDto() {}

    public LgoSubmissionRequestDto(
            String formType,
            UUID deviceSubmissionId,
            LocalDateTime formCompletedAt,
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            UUID villageId,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup,
            List<FiscalYearRecord> fiscalYearRecords,
            Boolean fundsAllocatedEquitably,
            Boolean allocatedFundsSufficient,
            Boolean adequateUtilisationOversight,
            Boolean transparentBeneficiarySelection,
            Boolean fundsSpentAsRequired,
            String fundsSpentExplanation,
            Boolean economicTransformation,
            String economicTransformationExplanation,
            String improvementSuggestion
    ) {
        super(formType, deviceSubmissionId, formCompletedAt, districtId, subcountyId, parishId, villageId, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        this.fiscalYearRecords = fiscalYearRecords;
        this.fundsAllocatedEquitably = fundsAllocatedEquitably;
        this.allocatedFundsSufficient = allocatedFundsSufficient;
        this.adequateUtilisationOversight = adequateUtilisationOversight;
        this.transparentBeneficiarySelection = transparentBeneficiarySelection;
        this.fundsSpentAsRequired = fundsSpentAsRequired;
        this.fundsSpentExplanation = fundsSpentExplanation;
        this.economicTransformation = economicTransformation;
        this.economicTransformationExplanation = economicTransformationExplanation;
        this.improvementSuggestion = improvementSuggestion;
    }

    public List<FiscalYearRecord> getFiscalYearRecords() { return fiscalYearRecords; }
    public Boolean getFundsAllocatedEquitably() { return fundsAllocatedEquitably; }
    public Boolean getAllocatedFundsSufficient() { return allocatedFundsSufficient; }
    public Boolean getAdequateUtilisationOversight() { return adequateUtilisationOversight; }
    public Boolean getTransparentBeneficiarySelection() { return transparentBeneficiarySelection; }
    public Boolean getFundsSpentAsRequired() { return fundsSpentAsRequired; }
    public String getFundsSpentExplanation() { return fundsSpentExplanation; }
    public Boolean getEconomicTransformation() { return economicTransformation; }
    public String getEconomicTransformationExplanation() { return economicTransformationExplanation; }
    public String getImprovementSuggestion() { return improvementSuggestion; }
}
