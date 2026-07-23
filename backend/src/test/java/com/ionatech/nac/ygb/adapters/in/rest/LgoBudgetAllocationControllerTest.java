package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.LgoBudgetAllocationRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.LgoBudgetAllocationRespondentDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.LgoBudgetAllocationRestMapperImpl;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationCommand;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationResult;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
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
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LgoBudgetAllocationController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, LgoBudgetAllocationRestMapperImpl.class})
class LgoBudgetAllocationControllerTest {

    private static final UUID COLLECTOR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RecordLgoBudgetAllocationUseCase recordUseCase;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldCreateAllocationWhenCollectorAuthenticated() throws Exception {
        UUID submissionId = UUID.randomUUID();
        UUID lbaId = UUID.randomUUID();
        RecordLgoBudgetAllocationResult result = new RecordLgoBudgetAllocationResult(submissionId, lbaId, "SYNCED");
        when(recordUseCase.record(any(RecordLgoBudgetAllocationCommand.class))).thenReturn(result);

        mockMvc.perform(post("/api/v1/submissions/lgo-budget-allocation")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.submissionId").value(submissionId.toString()))
                .andExpect(jsonPath("$.lbaId").value(lbaId.toString()))
                .andExpect(jsonPath("$.status").value("SYNCED"));

        verify(recordUseCase).record(any(RecordLgoBudgetAllocationCommand.class));
    }

    @Test
    void shouldRejectUnauthenticatedRequest() throws Exception {
        mockMvc.perform(post("/api/v1/submissions/lgo-budget-allocation")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isForbidden());

        verifyNoInteractions(recordUseCase);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldRejectAdminRole() throws Exception {
        mockMvc.perform(post("/api/v1/submissions/lgo-budget-allocation")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isForbidden());

        verifyNoInteractions(recordUseCase);
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldReturnBadRequestForInvalidPayload() throws Exception {
        LgoBudgetAllocationRequestDto invalidRequest = new LgoBudgetAllocationRequestDto(
                UUID.randomUUID(),
                LocalDateTime.of(2026, 3, 15, 10, 0),
                new LgoBudgetAllocationRespondentDto(
                        "District Health Officer",
                        "0772555666",
                        "FEMALE",
                        AgeGroup.AGE_30_AND_ABOVE,
                        TestLocationFixtures.KAMPALA_DISTRICT_ID,
                        TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                        TestLocationFixtures.KAMPALA_PARISH_ID,
                        TestLocationFixtures.KAMPALA_VILLAGE_ID
                ),
                Map.of(),
                "   ",
                "short"
        );

        mockMvc.perform(post("/api/v1/submissions/lgo-budget-allocation")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(recordUseCase);
    }

    private LgoBudgetAllocationRequestDto validRequest() {
        return new LgoBudgetAllocationRequestDto(
                UUID.randomUUID(),
                LocalDateTime.of(2026, 3, 15, 10, 0),
                new LgoBudgetAllocationRespondentDto(
                        "District Health Officer",
                        "0772555666",
                        "FEMALE",
                        AgeGroup.AGE_30_AND_ABOVE,
                        TestLocationFixtures.KAMPALA_DISTRICT_ID,
                        TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                        TestLocationFixtures.KAMPALA_PARISH_ID,
                        TestLocationFixtures.KAMPALA_VILLAGE_ID
                ),
                Map.of(
                        "health", Map.of("amount", 1_200_000, "percentage", 28),
                        "education", Map.of("amount", 900_000, "percentage", 22)
                ),
                "Health and education received the largest shares due to service delivery gaps.",
                "Increase agriculture extension funding and climate resilience programmes."
        );
    }
}
