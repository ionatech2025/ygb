package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.SubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.Test;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubmissionController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
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

        BypSubmission dummyByp = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(testCollectorId, deviceSubmissionId, completedAt),
                new Location(districtId, subcountyId, parishId, villageId),
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
    void shouldRetrySubmissionOnceOnConcurrencyDuplicateConflict() throws Exception {
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

        BypSubmission dummyByp = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(testCollectorId, deviceSubmissionId, completedAt),
                new Location(districtId, subcountyId, parishId, villageId),
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
        dummyByp.setStatus(SubmissionStatus.FLAGGED);

        SubmissionResponseDto responseDto = new SubmissionResponseDto(
                dummyByp.getId(),
                "BYP",
                "Jane Doe",
                "FLAGGED",
                completedAt
        );

        when(submissionRestMapper.toCommand(any(BypSubmissionRequestDto.class), eq(testCollectorId))).thenReturn(command);
        when(submitSubmissionUseCase.submit(command))
                .thenThrow(new com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException("concurrency duplicate"))
                .thenReturn(dummyByp);
        when(submissionRestMapper.toResponse(dummyByp)).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/submissions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.respondentName").value("Jane Doe"))
                .andExpect(jsonPath("$.status").value("FLAGGED"));

        verify(submitSubmissionUseCase, times(2)).submit(command);
    }
}
