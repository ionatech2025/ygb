package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriod;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BudgetPriorityUniquenessPolicyTest {

    private final PhoneNumber phone = PhoneNumber.of("0772123456");
    private final FinancialYearPeriod period = FinancialYearPeriod.from(LocalDateTime.of(2026, 3, 15, 10, 0));

    @Test
    void shouldRejectDuplicatePhoneSectionAndPeriod() {
        assertThatThrownBy(() -> BudgetPriorityUniquenessPolicy.ensureUnique(
                true,
                phone,
                BudgetPrioritySection.HEALTH,
                period
        )).isInstanceOf(DuplicateBudgetPrioritySubmissionException.class)
                .hasMessageContaining("health")
                .hasMessageContaining("0772123456")
                .hasMessageContaining("JAN_JUN_2026");
    }

    @Test
    void shouldAllowSamePhoneAndPeriodForDifferentSection() {
        assertThatCode(() -> BudgetPriorityUniquenessPolicy.ensureUnique(
                false,
                phone,
                BudgetPrioritySection.AGRICULTURE,
                period
        )).doesNotThrowAnyException();
    }

    @Test
    void shouldAllowWhenNoExistingSubmission() {
        assertThatCode(() -> BudgetPriorityUniquenessPolicy.ensureUnique(
                false,
                phone,
                BudgetPrioritySection.HEALTH,
                period
        )).doesNotThrowAnyException();
    }
}
