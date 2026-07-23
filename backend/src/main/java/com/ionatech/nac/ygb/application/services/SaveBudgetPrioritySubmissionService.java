package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.BudgetPrioritySubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.service.BudgetPriorityUniquenessPolicy;

public class SaveBudgetPrioritySubmissionService {

    private final BudgetPrioritySubmissionRepositoryPort repositoryPort;

    public SaveBudgetPrioritySubmissionService(BudgetPrioritySubmissionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    public BudgetPrioritySubmission save(BudgetPrioritySubmission submission) {
        boolean alreadyExists = repositoryPort.existsByPhoneSectionAndPeriod(
                submission.getPhoneNumber().getValue(),
                submission.getSection(),
                submission.getFinancialYearPeriod().toString()
        );
        BudgetPriorityUniquenessPolicy.ensureUnique(
                alreadyExists,
                submission.getPhoneNumber(),
                submission.getSection(),
                submission.getFinancialYearPeriod()
        );
        return repositoryPort.save(submission);
    }
}
