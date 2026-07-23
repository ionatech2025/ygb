package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPrioritySubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.event.BudgetPrioritySubmitted;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.service.FinancialYearPeriodCalculator;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDemographics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubmitBudgetPriorityServiceTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-03-15T10:00:00Z"),
            ZoneOffset.UTC
    );

    @Mock
    private BudgetPrioritySubmissionRepositoryPort repositoryPort;

    private SubmitBudgetPriorityService service;

    @BeforeEach
    void setUp() {
        service = new SubmitBudgetPriorityService(
                new SaveBudgetPrioritySubmissionService(repositoryPort),
                new FinancialYearPeriodCalculator(),
                FIXED_CLOCK
        );
    }

    @Test
    void shouldSubmitAndEmitDomainEvent() {
        SubmitBudgetPriorityCommand command = validCommand(BudgetPrioritySection.HEALTH);
        when(repositoryPort.existsByPhoneSectionAndPeriod(
                "0772123456",
                BudgetPrioritySection.HEALTH,
                "JAN_JUN_2026"
        )).thenReturn(false);
        when(repositoryPort.save(org.mockito.ArgumentMatchers.any(BudgetPrioritySubmission.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        BudgetPrioritySubmission saved = service.submit(command);

        assertThat(saved.getSection()).isEqualTo(BudgetPrioritySection.HEALTH);
        assertThat(saved.getFinancialYearPeriod().toString()).isEqualTo("JAN_JUN_2026");
        assertThat(saved.pullDomainEvents()).containsExactly(
                new BudgetPrioritySubmitted(saved.getBpId(), BudgetPrioritySection.HEALTH, "JAN_JUN_2026")
        );
    }

    @Test
    void shouldRejectDuplicatePhoneSectionAndPeriod() {
        when(repositoryPort.existsByPhoneSectionAndPeriod(
                eq("0772123456"),
                eq(BudgetPrioritySection.HEALTH),
                eq("JAN_JUN_2026")
        )).thenReturn(true);

        assertThatThrownBy(() -> service.submit(validCommand(BudgetPrioritySection.HEALTH)))
                .isInstanceOf(DuplicateBudgetPrioritySubmissionException.class);

        verify(repositoryPort, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void shouldAllowSamePhoneAndPeriodForDifferentSection() {
        when(repositoryPort.existsByPhoneSectionAndPeriod(
                "0772123456",
                BudgetPrioritySection.AGRICULTURE,
                "JAN_JUN_2026"
        )).thenReturn(false);
        when(repositoryPort.save(org.mockito.ArgumentMatchers.any(BudgetPrioritySubmission.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        BudgetPrioritySubmission saved = service.submit(validCommand(BudgetPrioritySection.AGRICULTURE));

        assertThat(saved.getSection()).isEqualTo(BudgetPrioritySection.AGRICULTURE);
    }

    @Test
    void shouldRejectInvalidPhoneNumber() {
        Map<String, Object> demographics = Map.of(
                BudgetPriorityDemographics.FULL_NAME, "Jane Nakato",
                BudgetPriorityDemographics.PHONE_NUMBER, "12345",
                BudgetPriorityDemographics.AGE_GROUP, "AGE_20_24",
                BudgetPriorityDemographics.GENDER, "FEMALE",
                BudgetPriorityDemographics.DISTRICT_ID, UUID.randomUUID().toString()
        );

        assertThatThrownBy(() -> service.submit(new SubmitBudgetPriorityCommand(
                BudgetPrioritySection.HEALTH,
                demographics,
                Map.of("rankedAreas", List.of("PRIMARY_HEALTH_CARE"))
        ))).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid Uganda phone number");
    }

    private SubmitBudgetPriorityCommand validCommand(BudgetPrioritySection section) {
        return new SubmitBudgetPriorityCommand(
                section,
                Map.of(
                        BudgetPriorityDemographics.FULL_NAME, "Jane Nakato",
                        BudgetPriorityDemographics.PHONE_NUMBER, "0772123456",
                        BudgetPriorityDemographics.AGE_GROUP, "AGE_20_24",
                        BudgetPriorityDemographics.GENDER, "FEMALE",
                        BudgetPriorityDemographics.DISTRICT_ID, UUID.randomUUID().toString()
                ),
                Map.of("rankedAreas", List.of("PRIMARY_HEALTH_CARE"))
        );
    }
}
