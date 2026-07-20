package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class IypSubmissionRequestDto extends SubmissionRequestDto {
    private Boolean awareOfPdm;
    private Boolean eligibleCriteriaAware;
    private Boolean appliedForFund;
    private Boolean accessedFund;
    private String rejectionNarrative;
    private List<String> reasonsForNotApplying;
    private List<String> informationChannels;
    private List<String> difficultiesFaced;
    private String limitationExplanation;
    private String improvementSuggestion;

    public IypSubmissionRequestDto() {}

    public IypSubmissionRequestDto(
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
            Boolean awareOfPdm,
            Boolean eligibleCriteriaAware,
            Boolean appliedForFund,
            Boolean accessedFund,
            String rejectionNarrative,
            List<String> reasonsForNotApplying,
            List<String> informationChannels,
            List<String> difficultiesFaced,
            String limitationExplanation,
            String improvementSuggestion
    ) {
        super(formType, deviceSubmissionId, formCompletedAt, districtId, subcountyId, parishId, villageId, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        this.awareOfPdm = awareOfPdm;
        this.eligibleCriteriaAware = eligibleCriteriaAware;
        this.appliedForFund = appliedForFund;
        this.accessedFund = accessedFund;
        this.rejectionNarrative = rejectionNarrative;
        this.reasonsForNotApplying = reasonsForNotApplying;
        this.informationChannels = informationChannels;
        this.difficultiesFaced = difficultiesFaced;
        this.limitationExplanation = limitationExplanation;
        this.improvementSuggestion = improvementSuggestion;
    }

    public Boolean getAwareOfPdm() { return awareOfPdm; }
    public Boolean getEligibleCriteriaAware() { return eligibleCriteriaAware; }
    public Boolean getAppliedForFund() { return appliedForFund; }
    public Boolean getAccessedFund() { return accessedFund; }
    public String getRejectionNarrative() { return rejectionNarrative; }
    public List<String> getReasonsForNotApplying() { return reasonsForNotApplying; }
    public List<String> getInformationChannels() { return informationChannels; }
    public List<String> getDifficultiesFaced() { return difficultiesFaced; }
    public String getLimitationExplanation() { return limitationExplanation; }
    public String getImprovementSuggestion() { return improvementSuggestion; }
}
