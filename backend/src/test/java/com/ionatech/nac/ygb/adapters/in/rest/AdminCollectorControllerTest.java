package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.CollectorTrackerRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorBreakdownQuery;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorLeaderboardQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DistrictCount;
import com.ionatech.nac.ygb.domain.valueobjects.FormTypeCount;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminCollectorController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, DashboardFilterRequestMapper.class, CollectorTrackerRestMapper.class})
class AdminCollectorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetCollectorLeaderboardQuery getCollectorLeaderboardQuery;

    @MockBean
    private GetCollectorBreakdownQuery getCollectorBreakdownQuery;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnLeaderboardForAdmin() throws Exception {
        UUID collectorId = UUID.randomUUID();
        when(getCollectorLeaderboardQuery.getLeaderboard(any(DashboardFilter.class)))
                .thenReturn(List.of(new CollectorLeaderboardEntry(collectorId, "Collector One", 5L)));

        mockMvc.perform(get("/api/v1/admin/collectors/leaderboard")
                        .param("formType", "BYP")
                        .param("financialYearPeriod", "JAN_JUN_2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].collectorId").value(collectorId.toString()))
                .andExpect(jsonPath("$[0].fullName").value("Collector One"))
                .andExpect(jsonPath("$[0].totalCount").value(5));

        verify(getCollectorLeaderboardQuery).getLeaderboard(any(DashboardFilter.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnBreakdownForAdmin() throws Exception {
        UUID collectorId = UUID.randomUUID();
        UUID districtId = UUID.randomUUID();
        CollectorBreakdown breakdown = new CollectorBreakdown(
                List.of(new FormTypeCount(FormType.BYP, 3L)),
                List.of(new DistrictCount("Arua", districtId, 3L))
        );
        when(getCollectorBreakdownQuery.getBreakdown(eq(collectorId), any(DashboardFilter.class)))
                .thenReturn(breakdown);

        mockMvc.perform(get("/api/v1/admin/collectors/{id}/breakdown", collectorId)
                        .param("formType", "BYP"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.byFormType[0].formType").value("BYP"))
                .andExpect(jsonPath("$.byFormType[0].count").value(3))
                .andExpect(jsonPath("$.byDistrict[0].districtName").value("Arua"))
                .andExpect(jsonPath("$.byDistrict[0].districtId").value(districtId.toString()))
                .andExpect(jsonPath("$.byDistrict[0].count").value(3));
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldRejectLeaderboardForNonAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/collectors/leaderboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldRejectBreakdownForNonAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/collectors/{id}/breakdown", UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRejectUnauthenticatedLeaderboardRequest() throws Exception {
        mockMvc.perform(get("/api/v1/admin/collectors/leaderboard"))
                .andExpect(status().isForbidden());
    }
}
