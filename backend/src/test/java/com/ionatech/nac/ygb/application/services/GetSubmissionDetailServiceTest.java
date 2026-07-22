package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionPayloadMapper;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.SubmissionNotFoundException;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GetSubmissionDetailServiceTest {

    private SubmissionRepositoryPort submissionRepositoryPort;
    private GetSubmissionDetailService service;
    private AdminSubmissionPayloadMapper payloadMapper;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final Location location = new Location(
            UUID.fromString("d1111111-1111-1111-1111-111111111111"),
            UUID.fromString("e2222222-2222-2222-2222-222222222222"),
            UUID.fromString("b3333333-3333-3333-3333-333333333333"),
            UUID.fromString("f4444444-4444-4444-4444-444444444444")
    );

    @BeforeEach
    void setUp() {
        submissionRepositoryPort = mock(SubmissionRepositoryPort.class);
        service = new GetSubmissionDetailService(submissionRepositoryPort);
        payloadMapper = new AdminSubmissionPayloadMapper();
    }

    @Test
    void shouldReturnDetailWhenSubmissionExists() {
        UUID submissionId = UUID.randomUUID();
        BypSubmission submission = sampleByp(submissionId);
        AdminSubmissionDetail detail = new AdminSubmissionDetail(
                submission,
                LocalDateTime.of(2026, 3, 15, 10, 5),
                "JAN_JUN_2026"
        );

        when(submissionRepositoryPort.findDetailById(submissionId)).thenReturn(Optional.of(detail));

        AdminSubmissionDetail result = service.getById(submissionId);

        assertThat(result.submission().getId()).isEqualTo(submissionId);
        assertThat(result.financialYearPeriod()).isEqualTo("JAN_JUN_2026");
    }

    @Test
    void shouldThrowWhenSubmissionNotFound() {
        UUID submissionId = UUID.randomUUID();
        when(submissionRepositoryPort.findDetailById(submissionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(submissionId))
                .isInstanceOf(SubmissionNotFoundException.class)
                .hasMessageContaining(submissionId.toString());
    }

    @Test
    void shouldMapFullPayloadForEachFormType() {
        assertThat(payloadMapper.toPayload(sampleByp(UUID.randomUUID()))).isInstanceOf(BypSubmissionRequestDto.class);
        assertThat(payloadMapper.toPayload(sampleIyp(UUID.randomUUID()))).isInstanceOf(IypSubmissionRequestDto.class);
        assertThat(payloadMapper.toPayload(sampleLgo(UUID.randomUUID()))).isInstanceOf(LgoSubmissionRequestDto.class);
        assertThat(payloadMapper.toPayload(samplePc(UUID.randomUUID()))).isInstanceOf(PcSubmissionRequestDto.class);

        BypSubmissionRequestDto bypDto = (BypSubmissionRequestDto) payloadMapper.toPayload(sampleByp(UUID.randomUUID()));
        assertThat(bypDto.getFormType()).isEqualTo("BYP");
        assertThat(bypDto.getExactAge()).isEqualTo(22);
        assertThat(bypDto.getImprovementSuggestion()).isEqualTo("Provide more technical support.");

        IypSubmissionRequestDto iypDto = (IypSubmissionRequestDto) payloadMapper.toPayload(sampleIyp(UUID.randomUUID()));
        assertThat(iypDto.getAwareOfPdm()).isTrue();
        assertThat(iypDto.getImprovementSuggestion()).isEqualTo("Improve awareness campaigns.");

        LgoSubmissionRequestDto lgoDto = (LgoSubmissionRequestDto) payloadMapper.toPayload(sampleLgo(UUID.randomUUID()));
        assertThat(lgoDto.getImprovementSuggestion()).isEqualTo("Increase oversight.");

        PcSubmissionRequestDto pcDto = (PcSubmissionRequestDto) payloadMapper.toPayload(samplePc(UUID.randomUUID()));
        assertThat(pcDto.getAmountExpected()).isEqualTo(1500000L);
        assertThat(pcDto.getMonitoredBy()).containsExactly("CAO");
    }

    private SubmissionMetadata metadata(UUID deviceSubmissionId) {
        return new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private BypSubmission sampleByp(UUID id) {
        return new BypSubmission(
                id,
                metadata(UUID.randomUUID()),
                location,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                new Age(22),
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
                new NarrativeText("Provide more technical support.")
        );
    }

    private IypSubmission sampleIyp(UUID id) {
        return new IypSubmission(
                id,
                metadata(UUID.randomUUID()),
                location,
                "John Four",
                "0773000111",
                "MALE",
                AgeGroup.AGE_15_19,
                true,
                true,
                true,
                false,
                new NarrativeText("Application rejected without clear feedback."),
                List.of("LACK_OF_COLLATERAL"),
                List.of("RADIO"),
                List.of("LIMITATION_IN_AMOUNT"),
                new NarrativeText("Explain limitation text here."),
                new NarrativeText("Improve awareness campaigns.")
        );
    }

    private LgoSubmission sampleLgo(UUID id) {
        return new LgoSubmission(
                id,
                metadata(UUID.randomUUID()),
                location,
                "District Officer",
                "0774000111",
                "MALE",
                AgeGroup.AGE_30_AND_ABOVE,
                List.of(new FiscalYearRecord("2024/25", 100000L, 80000L, 50, 20, 20, 5, 4)),
                true,
                true,
                true,
                true,
                true,
                null,
                true,
                null,
                new NarrativeText("Increase oversight.")
        );
    }

    private PcSubmission samplePc(UUID id) {
        return new PcSubmission(
                id,
                metadata(UUID.randomUUID()),
                location,
                "Parish Chief",
                "0775000111",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                1500000L,
                1200000L,
                50,
                20,
                15,
                new NarrativeText("Delays in disbursement."),
                true,
                12,
                5,
                7,
                true,
                List.of("FINANCIAL_MANAGEMENT"),
                "GOOD",
                List.of("CAO"),
                null,
                new NarrativeText("Regular field checks performed."),
                true,
                true,
                new NarrativeText("Improvements seen in poultry sectors."),
                true,
                new NarrativeText("Reports submitted quarterly."),
                10,
                8
        );
    }
}
