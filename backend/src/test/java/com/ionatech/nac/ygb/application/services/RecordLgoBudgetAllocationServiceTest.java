package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationCommand;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationResult;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocationSubmission;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionMetadata;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecordLgoBudgetAllocationServiceTest {

    private static final UUID COLLECTOR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID DEVICE_SUBMISSION_ID = UUID.randomUUID();
    private static final LocalDateTime COMPLETED_AT = LocalDateTime.of(2026, 3, 15, 10, 0);

    @Mock
    private UserRepositoryPort userRepositoryPort;

    @Mock
    private SubmissionRepositoryPort submissionRepositoryPort;

    @Mock
    private LgoBudgetAllocationRepositoryPort lgoBudgetAllocationRepositoryPort;

    private RecordLgoBudgetAllocationService service;

    @BeforeEach
    void setUp() {
        service = new RecordLgoBudgetAllocationService(
                userRepositoryPort,
                submissionRepositoryPort,
                new SaveLgoBudgetAllocationService(lgoBudgetAllocationRepositoryPort)
        );
    }

    @Test
    void shouldPersistSubmissionAndAllocationForCollector() {
        when(userRepositoryPort.findById(COLLECTOR_ID)).thenReturn(Optional.of(collectorUser()));
        when(submissionRepositoryPort.findByDeviceSubmissionId(DEVICE_SUBMISSION_ID)).thenReturn(Optional.empty());
        when(submissionRepositoryPort.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                any(), any(), any(), any()
        )).thenReturn(false);

        when(submissionRepositoryPort.save(any(LgoBudgetAllocationSubmission.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(lgoBudgetAllocationRepositoryPort.save(any(LgoBudgetAllocation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RecordLgoBudgetAllocationResult result = service.record(validCommand(COLLECTOR_ID));

        ArgumentCaptor<LgoBudgetAllocationSubmission> submissionCaptor =
                ArgumentCaptor.forClass(LgoBudgetAllocationSubmission.class);
        verify(submissionRepositoryPort).save(submissionCaptor.capture());
        LgoBudgetAllocationSubmission savedSubmission = submissionCaptor.getValue();

        assertThat(result.submissionId()).isEqualTo(savedSubmission.getId());
        assertThat(result.lbaId()).isNotNull();
        assertThat(result.status()).isEqualTo("SYNCED");

        ArgumentCaptor<LgoBudgetAllocation> allocationCaptor = ArgumentCaptor.forClass(LgoBudgetAllocation.class);
        verify(lgoBudgetAllocationRepositoryPort).save(allocationCaptor.capture());
        assertThat(allocationCaptor.getValue().getSubmissionId()).isEqualTo(savedSubmission.getId());
        assertThat(allocationCaptor.getValue().getRationale()).isEqualTo(
                "Health and education received the largest shares due to service delivery gaps."
        );
    }

    @Test
    void shouldRejectNonCollectorRole() {
        UUID adminId = UUID.randomUUID();
        User admin = new User(
                adminId,
                "Admin User",
                "0700000000",
                "hash",
                Role.ADMIN,
                true,
                LocalDateTime.of(2026, 1, 1, 0, 0)
        );
        when(userRepositoryPort.findById(adminId)).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> service.record(validCommand(adminId)))
                .isInstanceOf(InvalidUserOperationException.class)
                .hasMessageContaining("Only data collectors");
    }

    @Test
    void shouldReturnExistingResultForIdempotentDeviceSubmissionReplay() {
        UUID submissionId = UUID.randomUUID();
        UUID lbaId = UUID.randomUUID();
        LgoBudgetAllocationSubmission existingSubmission = sampleSubmission(submissionId);
        existingSubmission.setStatus(SubmissionStatus.SYNCED);
        LgoBudgetAllocation existingAllocation = LgoBudgetAllocation.rehydrate(
                lbaId,
                submissionId,
                Map.of("health", Map.of("amount", 500_000, "percentage", 30)),
                "Existing rationale with enough characters.",
                "Existing recommendations with enough detail.",
                COMPLETED_AT
        );

        when(userRepositoryPort.findById(COLLECTOR_ID)).thenReturn(Optional.of(collectorUser()));
        when(submissionRepositoryPort.findByDeviceSubmissionId(DEVICE_SUBMISSION_ID))
                .thenReturn(Optional.of(existingSubmission));
        when(lgoBudgetAllocationRepositoryPort.findBySubmissionId(submissionId))
                .thenReturn(Optional.of(existingAllocation));

        RecordLgoBudgetAllocationResult result = service.record(validCommand(COLLECTOR_ID));

        assertThat(result.submissionId()).isEqualTo(submissionId);
        assertThat(result.lbaId()).isEqualTo(lbaId);
        assertThat(result.status()).isEqualTo("SYNCED");
    }

    private RecordLgoBudgetAllocationCommand validCommand(UUID collectorId) {
        return new RecordLgoBudgetAllocationCommand(
                collectorId,
                DEVICE_SUBMISSION_ID,
                COMPLETED_AT,
                "District Health Officer",
                "0772555666",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                Map.of("health", Map.of("amount", 1_200_000, "percentage", 28)),
                "Health and education received the largest shares due to service delivery gaps.",
                "Increase agriculture extension funding and climate resilience programmes."
        );
    }

    private User collectorUser() {
        return new User(
                COLLECTOR_ID,
                "Test Collector",
                "0711111111",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.of(2026, 1, 1, 0, 0)
        );
    }

    private LgoBudgetAllocationSubmission sampleSubmission(UUID submissionId) {
        return new LgoBudgetAllocationSubmission(
                submissionId,
                new SubmissionMetadata(COLLECTOR_ID, DEVICE_SUBMISSION_ID, COMPLETED_AT),
                TestLocationFixtures.kampalaLocation(),
                "District Health Officer",
                "0772555666",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE
        );
    }
}
