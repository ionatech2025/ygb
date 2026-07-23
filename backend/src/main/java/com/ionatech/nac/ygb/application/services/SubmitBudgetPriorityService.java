package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityUseCase;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.service.FinancialYearPeriodCalculator;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDemographics;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

public class SubmitBudgetPriorityService implements SubmitBudgetPriorityUseCase {

    private final SaveBudgetPrioritySubmissionService saveService;
    private final FinancialYearPeriodCalculator financialYearPeriodCalculator;
    private final Clock clock;

    public SubmitBudgetPriorityService(
            SaveBudgetPrioritySubmissionService saveService,
            FinancialYearPeriodCalculator financialYearPeriodCalculator,
            Clock clock
    ) {
        this.saveService = saveService;
        this.financialYearPeriodCalculator = financialYearPeriodCalculator;
        this.clock = clock;
    }

    @Override
    public BudgetPrioritySubmission submit(SubmitBudgetPriorityCommand command) {
        Map<String, Object> demographics = normalizeDemographics(command.demographics());
        BudgetPriorityDemographics.validateRequiredFields(demographics);
        PhoneNumber phoneNumber = PhoneNumber.of(BudgetPriorityDemographics.extractPhoneNumber(demographics));

        LocalDateTime submittedAt = LocalDateTime.now(clock);
        financialYearPeriodCalculator.fromDateTime(submittedAt);

        BudgetPrioritySubmission submission = BudgetPrioritySubmission.recordNew(
                command.section(),
                phoneNumber,
                command.priorityAreas(),
                demographics,
                submittedAt
        );
        return saveService.save(submission);
    }

    private static Map<String, Object> normalizeDemographics(Map<String, Object> demographics) {
        Map<String, Object> normalized = new LinkedHashMap<>();
        if (demographics != null) {
            demographics.forEach((key, value) -> {
                if (value instanceof String text) {
                    normalized.put(key, text.trim());
                } else {
                    normalized.put(key, value);
                }
            });
        }
        if (normalized.containsKey(BudgetPriorityDemographics.PHONE_NUMBER)) {
            String rawPhone = String.valueOf(normalized.get(BudgetPriorityDemographics.PHONE_NUMBER));
            normalized.put(BudgetPriorityDemographics.PHONE_NUMBER, PhoneNumber.normalize(rawPhone));
        }
        return Map.copyOf(normalized);
    }
}
