package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPriorityDemographicsDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPrioritySubmissionRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityRestMapperImpl;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BudgetPriorityController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, BudgetPriorityRestMapperImpl.class})
class BudgetPriorityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubmitBudgetPriorityUseCase submitBudgetPriorityUseCase;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldCreateSubmissionWithoutAuthentication() throws Exception {
        UUID bpId = UUID.randomUUID();
        BudgetPrioritySubmission submission = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                Map.of("rankedAreas", List.of("PRIMARY_HEALTH_CARE")),
                Map.of(
                        "fullName", "Jane Nakato",
                        "phoneNumber", "0772123456",
                        "ageGroup", "AGE_20_24",
                        "gender", "FEMALE",
                        "districtId", UUID.randomUUID().toString()
                ),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
        when(submitBudgetPriorityUseCase.submit(any(SubmitBudgetPriorityCommand.class))).thenReturn(submission);

        mockMvc.perform(post("/api/v1/public/budget-priorities/health")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bpId").value(submission.getBpId().toString()))
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.section").value("health"))
                .andExpect(jsonPath("$.financialYearPeriod").value("JAN_JUN_2026"));
    }

    @Test
    void shouldReturnConflictProblemDetailForDuplicateSubmission() throws Exception {
        when(submitBudgetPriorityUseCase.submit(any(SubmitBudgetPriorityCommand.class)))
                .thenThrow(new DuplicateBudgetPrioritySubmissionException(
                        "A health Budget Priorities submission for phone 0772123456 already exists in JAN_JUN_2026."
                ));

        mockMvc.perform(post("/api/v1/public/budget-priorities/health")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Duplicate Budget Priority Submission"))
                .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("0772123456")));
    }

    @Test
    void shouldReturnBadRequestProblemDetailForInvalidPhone() throws Exception {
        when(submitBudgetPriorityUseCase.submit(any(SubmitBudgetPriorityCommand.class)))
                .thenThrow(new IllegalArgumentException("Invalid Uganda phone number: 12345"));

        mockMvc.perform(post("/api/v1/public/budget-priorities/health")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid Budget Priority Submission"))
                .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("Invalid Uganda phone number")));
    }

    private BudgetPrioritySubmissionRequestDto validRequest() {
        return new BudgetPrioritySubmissionRequestDto(
                new BudgetPriorityDemographicsDto(
                        "Jane Nakato",
                        "0772123456",
                        "AGE_20_24",
                        "FEMALE",
                        UUID.randomUUID().toString()
                ),
                Map.of("rankedAreas", List.of("PRIMARY_HEALTH_CARE"))
        );
    }
}
