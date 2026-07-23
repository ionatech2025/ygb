package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriod;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;

public final class BudgetPriorityUniquenessPolicy {

    private BudgetPriorityUniquenessPolicy() {
    }

    public static void ensureUnique(
            boolean alreadyExists,
            PhoneNumber phoneNumber,
            BudgetPrioritySection section,
            FinancialYearPeriod financialYearPeriod
    ) {
        if (alreadyExists) {
            throw new DuplicateBudgetPrioritySubmissionException(
                    "A %s Budget Priorities submission for phone %s already exists in %s."
                            .formatted(section.name().toLowerCase(), phoneNumber.getValue(), financialYearPeriod)
            );
        }
    }
}
