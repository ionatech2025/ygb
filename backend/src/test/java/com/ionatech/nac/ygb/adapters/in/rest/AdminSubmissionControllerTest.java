package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionPayloadMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetSubmissionDetailQuery;
import com.ionatech.nac.ygb.application.ports.api.ListSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminSubmissionController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        DashboardFilterRequestMapper.class,
        AdminSubmissionRestMapper.class,
        AdminSubmissionPayloadMapper.class
})
class AdminSubmissionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ListSubmissionsQuery listSubmissionsQuery;

    @MockBean
    private GetSubmissionDetailQuery getSubmissionDetailQuery;

    @MockBean
    private UserRepositoryPort userRepositoryPort;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnPaginatedSubmissionListForAdmin() throws Exception {
        UUID districtId = UUID.randomUUID();
        UUID submissionId = UUID.randomUUID();
        SubmissionPage page = new SubmissionPage(
                List.of(new SubmissionSummary(
                        submissionId,
                        FormType.BYP,
                        "Jane Doe",
                        districtId,
                        "Arua",
                        UUID.randomUUID(),
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

        when(listSubmissionsQuery.list(any(DashboardFilter.class), eq(PageRequest.of(0, 25)))).thenReturn(page);

        mockMvc.perform(get("/api/v1/admin/submissions")
                        .param("districtId", districtId.toString())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.items[0].id").value(submissionId.toString()))
                .andExpect(jsonPath("$.items[0].respondentName").value("Jane Doe"))
                .andExpect(jsonPath("$.items[0].districtName").value("Arua"));

        verify(listSubmissionsQuery).list(any(DashboardFilter.class), eq(PageRequest.of(0, 25)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnSubmissionDetailForAdmin() throws Exception {
        UUID submissionId = UUID.randomUUID();
        UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        BypSubmission submission = sampleByp(submissionId, collectorId);
        AdminSubmissionDetail detail = new AdminSubmissionDetail(
                submission,
                LocalDateTime.of(2026, 3, 15, 10, 5),
                "JAN_JUN_2026"
        );
        User collector = new User(
                collectorId,
                "Default Collector",
                "0771111111",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        when(getSubmissionDetailQuery.getById(submissionId)).thenReturn(detail);
        when(userRepositoryPort.findById(collectorId)).thenReturn(Optional.of(collector));

        mockMvc.perform(get("/api/v1/admin/submissions/{id}", submissionId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(submissionId.toString()))
                .andExpect(jsonPath("$.collectorName").value("Default Collector"))
                .andExpect(jsonPath("$.financialYearPeriod").value("JAN_JUN_2026"))
                .andExpect(jsonPath("$.payload.formType").value("BYP"))
                .andExpect(jsonPath("$.payload.respondentName").value("Jane Doe"));

        verify(getSubmissionDetailQuery).getById(submissionId);
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldReturnForbiddenForDataCollectorOnList() throws Exception {
        mockMvc.perform(get("/api/v1/admin/submissions"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldReturnForbiddenForDataCollectorOnDetail() throws Exception {
        mockMvc.perform(get("/api/v1/admin/submissions/{id}", UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    private BypSubmission sampleByp(UUID id, UUID collectorId) {
        Location location = new Location(
                UUID.fromString("d1111111-1111-1111-1111-111111111111"),
                UUID.fromString("e2222222-2222-2222-2222-222222222222"),
                UUID.fromString("b3333333-3333-3333-3333-333333333333"),
                UUID.fromString("f4444444-4444-4444-4444-444444444444")
        );
        return new BypSubmission(
                id,
                new SubmissionMetadata(collectorId, UUID.randomUUID(), LocalDateTime.of(2026, 3, 15, 10, 0)),
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
}
