package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;

public interface BudgetPrioritySubmissionRepositoryPort {

    BudgetPrioritySubmission save(BudgetPrioritySubmission submission);

    boolean existsByPhoneSectionAndPeriod(
            String phoneNumber,
            BudgetPrioritySection section,
            String financialYearPeriod
    );
}
