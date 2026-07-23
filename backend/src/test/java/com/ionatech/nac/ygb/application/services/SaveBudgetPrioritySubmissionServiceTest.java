package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.BudgetPrioritySubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
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
class SaveBudgetPrioritySubmissionServiceTest {

    @Mock
    private BudgetPrioritySubmissionRepositoryPort repositoryPort;

    private SaveBudgetPrioritySubmissionService service;

    private static final Map<String, Object> PRIORITY_AREAS = Map.of(
            "rankedAreas", List.of("PRIMARY_HEALTH_CARE")
    );

    private static final Map<String, Object> DEMOGRAPHICS = Map.of(
            "fullName", "Jane Nakato",
            "phoneNumber", "0772123456",
            "gender", "FEMALE",
            "ageGroup", "AGE_20_24",
            "districtId", UUID.randomUUID().toString()
    );

    @BeforeEach
    void setUp() {
        service = new SaveBudgetPrioritySubmissionService(repositoryPort);
    }

    @Test
    void shouldSaveWhenNoDuplicateExists() {
        BudgetPrioritySubmission submission = createSubmission(BudgetPrioritySection.HEALTH);
        when(repositoryPort.existsByPhoneSectionAndPeriod(
                "0772123456",
                BudgetPrioritySection.HEALTH,
                "JAN_JUN_2026"
        )).thenReturn(false);
        when(repositoryPort.save(submission)).thenReturn(submission);

        BudgetPrioritySubmission saved = service.save(submission);

        assertThat(saved).isSameAs(submission);
        verify(repositoryPort).save(submission);
    }

    @Test
    void shouldRejectDuplicatePhoneSectionAndPeriod() {
        BudgetPrioritySubmission submission = createSubmission(BudgetPrioritySection.HEALTH);
        when(repositoryPort.existsByPhoneSectionAndPeriod(
                eq("0772123456"),
                eq(BudgetPrioritySection.HEALTH),
                eq("JAN_JUN_2026")
        )).thenReturn(true);

        assertThatThrownBy(() -> service.save(submission))
                .isInstanceOf(DuplicateBudgetPrioritySubmissionException.class);

        verify(repositoryPort, never()).save(submission);
    }

    @Test
    void shouldAllowSamePhoneAndPeriodForDifferentSection() {
        BudgetPrioritySubmission submission = createSubmission(BudgetPrioritySection.AGRICULTURE);
        when(repositoryPort.existsByPhoneSectionAndPeriod(
                "0772123456",
                BudgetPrioritySection.AGRICULTURE,
                "JAN_JUN_2026"
        )).thenReturn(false);
        when(repositoryPort.save(submission)).thenReturn(submission);

        assertThat(service.save(submission)).isSameAs(submission);
    }

    private BudgetPrioritySubmission createSubmission(BudgetPrioritySection section) {
        return BudgetPrioritySubmission.recordNew(
                section,
                PhoneNumber.of("0772123456"),
                PRIORITY_AREAS,
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
    }
}
