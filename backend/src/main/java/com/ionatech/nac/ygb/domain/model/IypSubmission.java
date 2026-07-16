package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;
import java.util.UUID;

public class IypSubmission extends Submission {
    private final Boolean awareOfPdm;
    private final Boolean eligibleCriteriaAware;
    private final Boolean appliedForFund;
    private final Boolean accessedFund;
    private final NarrativeText rejectionNarrative;
    private final List<String> reasonsForNotApplying;
    private final List<String> informationChannels;
    private final List<String> difficultiesFaced;
    private final NarrativeText limitationExplanation;
    private final NarrativeText improvementSuggestion;

    public IypSubmission(
            UUID id,
            SubmissionMetadata metadata,
            Location location,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup,
            Boolean awareOfPdm,
            Boolean eligibleCriteriaAware,
            Boolean appliedForFund,
            Boolean accessedFund,
            NarrativeText rejectionNarrative,
            List<String> reasonsForNotApplying,
            List<String> informationChannels,
            List<String> difficultiesFaced,
            NarrativeText limitationExplanation,
            NarrativeText improvementSuggestion
    ) {
        super(id, metadata, location, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        
        if (awareOfPdm == null) {
            throw new IllegalArgumentException("Aware of PDM is required");
        }
        if (improvementSuggestion == null) {
            throw new IllegalArgumentException("Improvement suggestion is required");
        }

        this.awareOfPdm = awareOfPdm;
        this.eligibleCriteriaAware = eligibleCriteriaAware;
        this.appliedForFund = appliedForFund;
        this.accessedFund = accessedFund;
        this.rejectionNarrative = rejectionNarrative;
        this.reasonsForNotApplying = reasonsForNotApplying == null ? List.of() : List.copyOf(reasonsForNotApplying);
        this.informationChannels = informationChannels == null ? List.of() : List.copyOf(informationChannels);
        this.difficultiesFaced = difficultiesFaced == null ? List.of() : List.copyOf(difficultiesFaced);
        this.limitationExplanation = limitationExplanation;
        this.improvementSuggestion = improvementSuggestion;
    }

    public Boolean isAwareOfPdm() {
        return awareOfPdm;
    }

    public Boolean getEligibleCriteriaAware() {
        return eligibleCriteriaAware;
    }

    public Boolean getAppliedForFund() {
        return appliedForFund;
    }

    public Boolean isAccessedFund() {
        return accessedFund;
    }

    public NarrativeText getRejectionNarrative() {
        return rejectionNarrative;
    }

    public List<String> getReasonsForNotApplying() {
        return reasonsForNotApplying;
    }

    public List<String> getInformationChannels() {
        return informationChannels;
    }

    public List<String> getDifficultiesFaced() {
        return difficultiesFaced;
    }

    public NarrativeText getLimitationExplanation() {
        return limitationExplanation;
    }

    public NarrativeText getImprovementSuggestion() {
        return improvementSuggestion;
    }

    @Override
    public void validate() {
        if (Boolean.TRUE.equals(awareOfPdm)) {
            if (eligibleCriteriaAware == null) {
                throw new IllegalArgumentException("Eligibility criteria awareness is required when aware of PDM");
            }
            if (appliedForFund == null) {
                throw new IllegalArgumentException("Applied for fund is required when aware of PDM");
            }
            if (informationChannels.isEmpty()) {
                throw new IllegalArgumentException("Information channels is required when aware of PDM");
            }
            if (Boolean.TRUE.equals(appliedForFund)) {
                if (accessedFund == null) {
                    throw new IllegalArgumentException("Accessed fund is required when applied for fund");
                }
                if (Boolean.FALSE.equals(accessedFund) && rejectionNarrative == null) {
                    throw new IllegalArgumentException("Rejection narrative is required when applied but not accessed");
                }
            } else if (Boolean.FALSE.equals(appliedForFund)) {
                if (reasonsForNotApplying.isEmpty()) {
                    throw new IllegalArgumentException("Reasons for not applying is required when user did not apply");
                }
            }
        }
        if (difficultiesFaced.contains("LIMITATION_IN_AMOUNT") && limitationExplanation == null) {
            throw new IllegalArgumentException("Limitation explanation is required when LIMITATION_IN_AMOUNT difficulty is selected");
        }
    }
}
