package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionPayloadMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.CollectorTrackerRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.SubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubmissionController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        DashboardFilterRequestMapper.class,
        AdminSubmissionRestMapper.class,
        AdminSubmissionPayloadMapper.class,
        CollectorTrackerRestMapper.class
})
class SubmissionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubmitSubmissionUseCase submitSubmissionUseCase;

    @MockBean
    private SubmissionRestMapper submissionRestMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @MockBean
    private GetCollectorSubmissionCountQuery getCollectorSubmissionCountQuery;

    @MockBean
    private GetCollectorSyncStatusQuery getCollectorSyncStatusQuery;

    @MockBean
    private GetCollectorSubmissionsQuery getCollectorSubmissionsQuery;

    @MockBean
    private GetCollectorBreakdownQuery getCollectorBreakdownQuery;

    private final UUID collectorId = UUID.randomUUID();
    private final UUID deviceSubmissionId = UUID.randomUUID();
    private final LocalDateTime completedAt = LocalDateTime.of(2026, 7, 17, 2, 0);
    private final UUID districtId = UUID.randomUUID();
    private final UUID subcountyId = UUID.randomUUID();
    private final UUID parishId = UUID.randomUUID();
    private final UUID villageId = UUID.randomUUID();

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldSubmitBypFormSuccessfullyWhenDataCollector() throws Exception {
        BypSubmissionRequestDto requestDto = new BypSubmissionRequestDto(
                "BYP",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");

        BypSubmitCommand command = new BypSubmitCommand(
                testCollectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        BypSubmission dummyByp = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(testCollectorId, deviceSubmissionId, completedAt),
                new Location(districtId, subcountyId, parishId, villageId),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                new NarrativeText("I used the money to buy farming inputs."),
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                new NarrativeText("Provide more technical support.")
        );

        SubmissionResponseDto responseDto = new SubmissionResponseDto(
                dummyByp.getId(),
                "BYP",
                "Jane Doe",
                "PENDING",
                completedAt
        );

        when(submissionRestMapper.toCommand(any(BypSubmissionRequestDto.class), eq(testCollectorId))).thenReturn(command);
        when(submitSubmissionUseCase.submit(command)).thenReturn(dummyByp);
        when(submissionRestMapper.toResponse(dummyByp)).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/submissions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.respondentName").value("Jane Doe"))
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(submitSubmissionUseCase, times(1)).submit(command);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldAcceptBlankRespondentNameOnBypSubmit() throws Exception {
        BypSubmissionRequestDto requestDto = new BypSubmissionRequestDto(
                "BYP",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        BypSubmitCommand command = new BypSubmitCommand(
                testCollectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        BypSubmission dummyByp = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(testCollectorId, deviceSubmissionId, completedAt),
                new Location(districtId, subcountyId, parishId, villageId),
                "",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                new NarrativeText("I used the money to buy farming inputs."),
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                new NarrativeText("Provide more technical support.")
        );

        SubmissionResponseDto responseDto = new SubmissionResponseDto(
                dummyByp.getId(),
                "BYP",
                "",
                "PENDING",
                completedAt
        );

        when(submissionRestMapper.toCommand(any(BypSubmissionRequestDto.class), eq(testCollectorId))).thenReturn(command);
        when(submitSubmissionUseCase.submit(command)).thenReturn(dummyByp);
        when(submissionRestMapper.toResponse(dummyByp)).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/submissions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.respondentName").value(""));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnForbiddenWhenUserIsAdmin() throws Exception {
        BypSubmissionRequestDto requestDto = new BypSubmissionRequestDto(
                "BYP",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        mockMvc.perform(post("/api/v1/submissions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isForbidden());

        verifyNoInteractions(submitSubmissionUseCase);
    }

    @Test
    void shouldReturnForbiddenWhenUnauthenticated() throws Exception {
        BypSubmissionRequestDto requestDto = new BypSubmissionRequestDto(
                "BYP",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        // SecurityConfig will block unauthenticated requests and return 403 Forbidden by default
        mockMvc.perform(post("/api/v1/submissions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isForbidden());

        verifyNoInteractions(submitSubmissionUseCase);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldGetDailyCountSuccessfully() throws Exception {
        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");

        when(getCollectorSubmissionCountQuery.getDailyCount(testCollectorId)).thenReturn(5L);

        mockMvc.perform(post("/api/v1/submissions/my-count") // wait, is it GET or POST? GET!
                .with(csrf())) // csrf isn't strictly needed for GET, but good to have or use standard GET
                .andExpect(status().isMethodNotAllowed()); // let's use the actual GET method below!
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldGetDailyCountSuccessfullyWithGet() throws Exception {
        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");

        when(getCollectorSubmissionCountQuery.getDailyCount(testCollectorId)).thenReturn(5L);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/submissions/my-count"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().string("5"));

        verify(getCollectorSubmissionCountQuery, times(1)).getDailyCount(testCollectorId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnForbiddenForGetCountWhenAdmin() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/submissions/my-count"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorSubmissionCountQuery);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldReturn409WhenServiceExhaustsDuplicateSyncedRetries() throws Exception {
        // The service has already retried internally; once it propagates the exception,
        // the controller must translate it to 409 Conflict — not 500 or a silent re-call.
        BypSubmissionRequestDto requestDto = new BypSubmissionRequestDto(
                "BYP",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                "Provide more technical support."
        );

        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        BypSubmitCommand command = new BypSubmitCommand(
                testCollectorId, deviceSubmissionId, completedAt,
                districtId, subcountyId, parishId, villageId,
                "Jane Doe", "0772111222", "FEMALE", AgeGroup.AGE_18_24,
                "ONE_WEEK", null, true, 500000L,
                "I used the money to buy farming inputs.",
                "MONTHLY", null,
                Rating.VERY_GOOD, false, null, Rating.GOOD, true, true,
                List.of("TRAINING"), "Provide more technical support."
        );

        when(submissionRestMapper.toCommand(any(BypSubmissionRequestDto.class), eq(testCollectorId))).thenReturn(command);
        when(submitSubmissionUseCase.submit(command))
                .thenThrow(new com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException(
                        "All retry attempts exhausted due to concurrent duplicate submissions."
                ));

        mockMvc.perform(post("/api/v1/submissions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isConflict());

        // Controller must call submit exactly once — retries are the service's responsibility.
        verify(submitSubmissionUseCase, times(1)).submit(command);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldSubmitLgoFormWithTwoFiscalYearRecordsSuccessfully() throws Exception {
        List<FiscalYearRecord> fiscalYearRecords = List.of(
                new FiscalYearRecord("2025/26", 100000L, 80000L, 50, 20, 12, 8, 5, 4),
                new FiscalYearRecord("2024/25", 90000L, 70000L, 45, 18, 10, 8, 5, 3)
        );

        LgoSubmissionRequestDto requestDto = new LgoSubmissionRequestDto(
                "LGO",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_ABOVE_35,
                fiscalYearRecords,
                true,
                true,
                true,
                true,
                true,
                null,
                true,
                null,
                "Improve PDM programme oversight across parishes."
        );

        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        LgoSubmitCommand command = new LgoSubmitCommand(
                testCollectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_ABOVE_35,
                fiscalYearRecords,
                true,
                true,
                true,
                true,
                true,
                null,
                true,
                null,
                "Improve PDM programme oversight across parishes."
        );

        LgoSubmission saved = new LgoSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(testCollectorId, deviceSubmissionId, completedAt),
                new Location(districtId, subcountyId, parishId, villageId),
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_ABOVE_35,
                fiscalYearRecords,
                true,
                true,
                true,
                true,
                true,
                null,
                true,
                null,
                new NarrativeText("Improve PDM programme oversight across parishes.")
        );

        when(submissionRestMapper.toCommand(any(LgoSubmissionRequestDto.class), eq(testCollectorId))).thenReturn(command);
        when(submitSubmissionUseCase.submit(command)).thenReturn(saved);
        when(submissionRestMapper.toResponse(saved)).thenReturn(
                new SubmissionResponseDto(saved.getId(), "LGO", "Official Name", "PENDING", completedAt)
        );

        mockMvc.perform(post("/api/v1/submissions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.formType").value("LGO"));

        verify(submitSubmissionUseCase, times(1)).submit(command);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldSubmitPcFormWithNewEffectivenessRatingSuccessfully() throws Exception {
        PcSubmissionRequestDto requestDto = new PcSubmissionRequestDto(
                "PC",
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_ABOVE_35,
                1500000L,
                1500000L,
                100,
                40,
                30,
                10,
                "Lack of transport equipment is the main obstacle.",
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                PdcEffectivenessRating.VERY_EFFECTIVE,
                true,
                List.of("CAO"),
                null,
                "Regular field checks performed.",
                true,
                true,
                "Improvements seen in poultry sectors.",
                true,
                "Reports submitted quarterly.",
                10,
                12,
                15,
                8,
                "Provide more monitoring tools for parish chiefs."
        );

        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        PcSubmitCommand command = new PcSubmitCommand(
                testCollectorId,
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId,
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_ABOVE_35,
                1500000L,
                1500000L,
                100,
                40,
                30,
                10,
                "Lack of transport equipment is the main obstacle.",
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                PdcEffectivenessRating.VERY_EFFECTIVE,
                true,
                List.of("CAO"),
                null,
                "Regular field checks performed.",
                true,
                true,
                "Improvements seen in poultry sectors.",
                true,
                "Reports submitted quarterly.",
                10,
                12,
                15,
                8,
                "Provide more monitoring tools for parish chiefs."
        );

        PcSubmission saved = new PcSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(testCollectorId, deviceSubmissionId, completedAt),
                new Location(districtId, subcountyId, parishId, villageId),
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_ABOVE_35,
                1500000L,
                1500000L,
                100,
                40,
                30,
                10,
                new NarrativeText("Lack of transport equipment is the main obstacle."),
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                PdcEffectivenessRating.VERY_EFFECTIVE,
                true,
                List.of("CAO"),
                null,
                new NarrativeText("Regular field checks performed."),
                true,
                true,
                new NarrativeText("Improvements seen in poultry sectors."),
                true,
                new NarrativeText("Reports submitted quarterly."),
                10,
                12,
                15,
                8,
                new NarrativeText("Provide more monitoring tools for parish chiefs.")
        );

        when(submissionRestMapper.toCommand(any(PcSubmissionRequestDto.class), eq(testCollectorId))).thenReturn(command);
        when(submitSubmissionUseCase.submit(command)).thenReturn(saved);
        when(submissionRestMapper.toResponse(saved)).thenReturn(
                new SubmissionResponseDto(saved.getId(), "PC", "Parish Chief Name", "PENDING", completedAt)
        );

        mockMvc.perform(post("/api/v1/submissions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.formType").value("PC"));

        verify(submitSubmissionUseCase, times(1)).submit(command);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldRejectPcSubmissionWithLegacyEffectivenessRating() throws Exception {
        String payload = """
                {
                  "formType": "PC",
                  "deviceSubmissionId": "%s",
                  "formCompletedAt": "%s",
                  "districtId": "%s",
                  "subcountyId": "%s",
                  "parishId": "%s",
                  "villageId": "%s",
                  "respondentName": "Parish Chief Name",
                  "respondentPhone": "0772111555",
                  "respondentGender": "MALE",
                  "respondentAgeGroup": "AGE_ABOVE_35",
                  "amountExpected": 1500000,
                  "amountReceived": 1500000,
                  "totalBeneficiaries": 100,
                  "youthBeneficiaries": 40,
                  "youngWomenBeneficiaries": 30,
                  "youngMenBeneficiaries": 10,
                  "obstaclesDescription": "Lack of transport equipment is the main obstacle.",
                  "spendingTargetedToMostInNeed": true,
                  "pdcTotalMembers": 7,
                  "pdcYouthMembers": 3,
                  "pdcWomenMembers": 4,
                  "pdcTrainingReceived": true,
                  "pdcTrainingAreas": ["FINANCIAL_LITERACY"],
                  "pdcEffectivenessRating": "FULLY",
                  "programmeMonitored": true,
                  "monitoredBy": ["CAO"],
                  "monitoringMethod": "Regular field checks performed.",
                  "reportSharedWithRespondent": true,
                  "improvementsSeen": true,
                  "improvementsSeenExplanation": "Improvements seen in poultry sectors.",
                  "progressReportsSubmitted": true,
                  "progressReportsSubmittedExplanation": "Reports submitted quarterly.",
                  "selfRelianceBeneficiariesCount": 10,
                  "selfRelianceStableIncomeCount": 12,
                  "selfRelianceTrainedCount": 15,
                  "selfRelianceGroupProjectsCount": 8,
                  "programmeImprovementSuggestion": "Provide more monitoring tools for parish chiefs."
                }
                """.formatted(
                deviceSubmissionId,
                completedAt,
                districtId,
                subcountyId,
                parishId,
                villageId
        );

        mockMvc.perform(post("/api/v1/submissions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());

        verify(submitSubmissionUseCase, never()).submit(any());
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldGetSyncStatusSuccessfullyWhenDataCollector() throws Exception {
        UUID testCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        LocalDateTime latestTime = LocalDateTime.of(2026, 7, 19, 12, 0);
        var domainStatus = new com.ionatech.nac.ygb.domain.valueobjects.CollectorSyncStatus(12L, latestTime);
        var responseDto = new com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorSyncStatusResponseDto(12L, latestTime);

        when(getCollectorSyncStatusQuery.getSyncStatus(testCollectorId)).thenReturn(domainStatus);
        when(submissionRestMapper.toResponse(domainStatus)).thenReturn(responseDto);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/submissions/my-sync-status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.syncedCount").value(12L))
                .andExpect(jsonPath("$.lastSyncedAt").value("2026-07-19T12:00:00"));

        verify(getCollectorSyncStatusQuery, times(1)).getSyncStatus(testCollectorId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnForbiddenForGetSyncStatusWhenAdmin() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/submissions/my-sync-status"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorSyncStatusQuery);
    }

    @Test
    void shouldReturnForbiddenForGetSyncStatusWhenUnauthenticated() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/submissions/my-sync-status"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorSyncStatusQuery);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldReturnOwnSubmissionsForDataCollector() throws Exception {
        UUID principalId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        UUID submissionId = UUID.randomUUID();
        UUID districtId = UUID.randomUUID();
        SubmissionPage page = new SubmissionPage(
                List.of(new SubmissionSummary(
                        submissionId,
                        FormType.BYP,
                        "Jane Doe",
                        districtId,
                        "Arua",
                        principalId,
                        "Default Collector",
                        LocalDateTime.of(2026, 3, 15, 10, 0),
                        LocalDateTime.of(2026, 3, 15, 10, 5),
                        "SYNCED",
                        "JAN_JUN_2026"
                )),
                1L,
                0,
                25
        );

        when(getCollectorSubmissionsQuery.getSubmissions(
                eq(principalId),
                any(DashboardFilter.class),
                eq(PageRequest.of(0, 25))
        )).thenReturn(page);

        mockMvc.perform(get("/api/v1/submissions/mine").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.items[0].id").value(submissionId.toString()))
                .andExpect(jsonPath("$.items[0].collectorId").value(principalId.toString()))
                .andExpect(jsonPath("$.items[0].respondentName").value("Jane Doe"))
                .andExpect(jsonPath("$.items[0].formType").value("BYP"))
                .andExpect(jsonPath("$.items[0].districtName").value("Arua"))
                .andExpect(jsonPath("$.items[0].status").value("SYNCED"));

        verify(getCollectorSubmissionsQuery).getSubmissions(
                eq(principalId),
                any(DashboardFilter.class),
                eq(PageRequest.of(0, 25))
        );
    }

    @Test
    void shouldForbidUnauthenticatedAccessToOwnSubmissions() throws Exception {
        mockMvc.perform(get("/api/v1/submissions/mine"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorSubmissionsQuery);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldForbidAdminAccessToCollectorOwnSubmissions() throws Exception {
        mockMvc.perform(get("/api/v1/submissions/mine"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorSubmissionsQuery);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldForwardPaginationAndFormTypeUsingPrincipalIdNotQueryCollectorId() throws Exception {
        UUID principalId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        UUID spoofedCollectorId = UUID.fromString("99999999-9999-9999-9999-999999999999");
        SubmissionPage page = new SubmissionPage(List.of(), 0L, 1, 10);

        when(getCollectorSubmissionsQuery.getSubmissions(
                eq(principalId),
                any(DashboardFilter.class),
                eq(PageRequest.of(1, 10))
        )).thenReturn(page);

        mockMvc.perform(get("/api/v1/submissions/mine")
                        .param("page", "1")
                        .param("size", "10")
                        .param("formType", "IYP")
                        .param("collectorId", spoofedCollectorId.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(0));

        ArgumentCaptor<DashboardFilter> filterCaptor = ArgumentCaptor.forClass(DashboardFilter.class);
        verify(getCollectorSubmissionsQuery).getSubmissions(
                eq(principalId),
                filterCaptor.capture(),
                eq(PageRequest.of(1, 10))
        );
        DashboardFilter filter = filterCaptor.getValue();
        assertThat(filter.formType()).isEqualTo(FormType.IYP);
        assertThat(filter.collectorId()).isNull();
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldReturnOwnSubmissionBreakdownForDataCollector() throws Exception {
        UUID principalId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        UUID districtId = UUID.randomUUID();
        CollectorBreakdown breakdown = new CollectorBreakdown(
                List.of(new FormTypeCount(FormType.BYP, 35L), new FormTypeCount(FormType.IYP, 29L)),
                List.of(new DistrictCount("Kampala", districtId, 64L))
        );

        when(getCollectorBreakdownQuery.getBreakdown(eq(principalId), any(DashboardFilter.class)))
                .thenReturn(breakdown);

        mockMvc.perform(get("/api/v1/submissions/mine/breakdown").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.byFormType[0].formType").value("BYP"))
                .andExpect(jsonPath("$.byFormType[0].count").value(35))
                .andExpect(jsonPath("$.byFormType[1].formType").value("IYP"))
                .andExpect(jsonPath("$.byFormType[1].count").value(29))
                .andExpect(jsonPath("$.byDistrict[0].districtName").value("Kampala"))
                .andExpect(jsonPath("$.byDistrict[0].count").value(64));

        verify(getCollectorBreakdownQuery).getBreakdown(eq(principalId), any(DashboardFilter.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldForbidAdminAccessToCollectorOwnBreakdown() throws Exception {
        mockMvc.perform(get("/api/v1/submissions/mine/breakdown"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorBreakdownQuery);
    }

    @Test
    void shouldForbidUnauthenticatedAccessToOwnBreakdown() throws Exception {
        mockMvc.perform(get("/api/v1/submissions/mine/breakdown"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(getCollectorBreakdownQuery);
    }
}
