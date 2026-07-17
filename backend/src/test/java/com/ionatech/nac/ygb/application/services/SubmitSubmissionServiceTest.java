package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SubmitSubmissionServiceTest {

    private SubmissionRepositoryPort repositoryPort;
    private SubmitSubmissionService service;

    private final UUID collectorId = UUID.randomUUID();
    private final UUID deviceSubmissionId = UUID.randomUUID();
    private final LocalDateTime completedAt = LocalDateTime.now();
    private final UUID districtId = UUID.randomUUID();
    private final UUID subcountyId = UUID.randomUUID();
    private final UUID parishId = UUID.randomUUID();
    private final UUID villageId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        repositoryPort = mock(SubmissionRepositoryPort.class);
        service = new SubmitSubmissionService(repositoryPort);
    }

    @Test
    void shouldSubmitBypFormSuccessfully() {
        BypSubmitCommand command = new BypSubmitCommand(
                collectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                22,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support and early training."
        );

        when(repositoryPort.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission result = service.submit(command);

        assertThat(result).isInstanceOf(BypSubmission.class);
        BypSubmission byp = (BypSubmission) result;
        assertThat(byp.getRespondentName()).isEqualTo("Jane Doe");
        assertThat(byp.getExactAge().getValue()).isEqualTo(22);
        assertThat(byp.getStatus()).isEqualTo(SubmissionStatus.SYNCED);
        assertThat(byp.getMetadata().financialYearPeriod().toString()).isNotNull();

        ArgumentCaptor<Submission> captor = ArgumentCaptor.forClass(Submission.class);
        verify(repositoryPort, times(1)).save(captor.capture());
        assertThat(captor.getValue()).isEqualTo(byp);
    }

    @Test
    void shouldThrowValidationExceptionWhenBypDomainValidationFails() {
        BypSubmitCommand command = new BypSubmitCommand(
                collectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                22,
                "MONTHS", // requires specify
                null, // missing specify
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        assertThatThrownBy(() -> service.submit(command))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("fundReceiptDurationSpecify is required");

        verify(repositoryPort, never()).save(any(Submission.class));
    }

    @Test
    void shouldSubmitIypFormSuccessfully() {
        IypSubmitCommand command = new IypSubmitCommand(
                collectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "John Doe",
                "0772111333",
                "MALE",
                AgeGroup.AGE_15_19,
                false, // unaware of PDM
                null,
                null,
                null,
                null,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                null,
                "Make information more accessible in rural areas."
        );

        when(repositoryPort.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission result = service.submit(command);

        assertThat(result).isInstanceOf(IypSubmission.class);
        IypSubmission iyp = (IypSubmission) result;
        assertThat(iyp.isAwareOfPdm()).isFalse();

        verify(repositoryPort, times(1)).save(any(Submission.class));
    }

    @Test
    void shouldSubmitLgoFormSuccessfully() {
        LgoSubmitCommand command = new LgoSubmitCommand(
                collectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                List.of(new FiscalYearRecord("2024/25", 100000L, 80000L, 50, 20, 20, 5, 4)),
                true,
                null,
                true,
                null,
                "Provide more monitoring tools."
        );

        when(repositoryPort.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission result = service.submit(command);

        assertThat(result).isInstanceOf(LgoSubmission.class);
        LgoSubmission lgo = (LgoSubmission) result;
        assertThat(lgo.getRespondentName()).isEqualTo("Official Name");

        verify(repositoryPort, times(1)).save(any(Submission.class));
    }

    @Test
    void shouldSubmitPcFormSuccessfully() {
        PcSubmitCommand command = new PcSubmitCommand(
                collectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_30_AND_ABOVE,
                1500000L,
                1500000L,
                100,
                40,
                30,
                "Lack of transport equipment is the main obstacle.",
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                "HIGHLY_EFFECTIVE",
                List.of("CAO"),
                null,
                "Regular fields checks performed.",
                true,
                true,
                "Improvements seen in poultry sectors.",
                true,
                "Reports submitted quarterly.",
                10,
                8
        );

        when(repositoryPort.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission result = service.submit(command);

        assertThat(result).isInstanceOf(PcSubmission.class);
        PcSubmission pc = (PcSubmission) result;
        assertThat(pc.getAmountExpected()).isEqualTo(1500000L);

        verify(repositoryPort, times(1)).save(any(Submission.class));
    }

    @Test
    void shouldSubmitAsSyncedWhenNoDuplicateExists() {
        BypSubmitCommand command = createSampleBypCommand();
        when(repositoryPort.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                anyString(), any(FormType.class), anyString(), any(SubmissionStatus.class)
        )).thenReturn(false);
        when(repositoryPort.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission result = service.submit(command);

        assertThat(result.getStatus()).isEqualTo(SubmissionStatus.SYNCED);
        verify(repositoryPort, times(1)).existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                "0772111222", FormType.BYP, result.getMetadata().financialYearPeriod().toString(), SubmissionStatus.SYNCED
        );
    }

    @Test
    void shouldSubmitAsFlaggedWhenDuplicateSyncedExists() {
        BypSubmitCommand command = createSampleBypCommand();
        when(repositoryPort.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                anyString(), any(FormType.class), anyString(), any(SubmissionStatus.class)
        )).thenReturn(true);
        when(repositoryPort.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission result = service.submit(command);

        assertThat(result.getStatus()).isEqualTo(SubmissionStatus.FLAGGED);
        verify(repositoryPort, times(1)).existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                "0772111222", FormType.BYP, result.getMetadata().financialYearPeriod().toString(), SubmissionStatus.SYNCED
        );
    }

    private BypSubmitCommand createSampleBypCommand() {
        return new BypSubmitCommand(
                collectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                22,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );
    }
}
