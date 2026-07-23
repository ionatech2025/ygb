package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.Location;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionMetadata;

import java.util.UUID;

public class LgoBudgetAllocationSubmission extends Submission {

    public LgoBudgetAllocationSubmission(
            UUID id,
            SubmissionMetadata metadata,
            Location location,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup
    ) {
        super(id, metadata, location, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
    }

    @Override
    public FormType getFormType() {
        return FormType.LGO_BUDGET_ALLOCATION;
    }

    @Override
    public void validate() {
        // Respondent envelope is validated in the base constructor; allocation fields are validated on LgoBudgetAllocation.
    }
}
