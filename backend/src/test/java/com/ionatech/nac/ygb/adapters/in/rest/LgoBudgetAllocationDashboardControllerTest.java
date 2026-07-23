package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.LgoBudgetAllocationDashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.LgoBudgetAllocationDashboardRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationChartDataQuery;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationDashboardSummaryQuery;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LgoBudgetAllocationDashboardController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        AnonymisationProjector.class,
        LgoBudgetAllocationDashboardFilterRequestMapper.class
})
class LgoBudgetAllocationDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetLgoBudgetAllocationFilterOptionsQuery getFilterOptionsQuery;

    @MockBean
    private GetLgoBudgetAllocationDashboardSummaryQuery getSummaryQuery;

    @MockBean
    private GetLgoBudgetAllocationChartDataQuery getChartDataQuery;

    @MockBean
    private LgoBudgetAllocationDashboardRestMapper restMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnSummaryWithoutAuthentication() throws Exception {
        UUID kampalaId = TestLocationFixtures.KAMPALA_DISTRICT_ID;
        LgoBudgetAllocationSummary summary = new LgoBudgetAllocationSummary(
                2L,
                List.of(new LgoBudgetAllocationDistrictCount(kampalaId, "Kampala", 2L)),
                List.of(new LgoBudgetAllocationSectorCount("health", 2L))
        );
        LgoBudgetAllocationSummaryResponseDto responseDto = new LgoBudgetAllocationSummaryResponseDto(
                2L,
                List.of(new LgoBudgetAllocationDistrictCountDto(kampalaId, "Kampala", 2L)),
                List.of(new LgoBudgetAllocationSectorCountDto("health", 2L))
        );

        when(getSummaryQuery.getSummary(any(LgoBudgetAllocationDashboardFilter.class))).thenReturn(summary);
        when(restMapper.toSummaryResponse(summary)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/public/dashboard/lgo-budget-allocation/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(2))
                .andExpect(jsonPath("$.byDistrict[0].districtLabel").value("Kampala"))
                .andExpect(jsonPath("$.topSectors[0].sector").value("health"))
                .andExpect(jsonPath("$.phoneNumber").doesNotExist())
                .andExpect(jsonPath("$.respondentName").doesNotExist())
                .andExpect(jsonPath("$.rationale").doesNotExist())
                .andExpect(jsonPath("$.recommendations").doesNotExist());
    }

    @Test
    void shouldReturnByDistrictChartForCrossDistrictComparison() throws Exception {
        stubChart(LgoBudgetAllocationChartType.BY_DISTRICT, "by-district", "Kampala");

        mockMvc.perform(get("/api/v1/public/dashboard/lgo-budget-allocation/charts/by-district"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chartType").value("by-district"))
                .andExpect(jsonPath("$.data[0].label").value("Kampala"));
    }

    @Test
    void shouldReturnBadRequestForInvalidDateRange() throws Exception {
        mockMvc.perform(get("/api/v1/public/dashboard/lgo-budget-allocation/summary")
                        .param("dateFrom", "2026-03-20")
                        .param("dateTo", "2026-03-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void shouldReturnBadRequestForUnsupportedChartType() throws Exception {
        mockMvc.perform(get("/api/v1/public/dashboard/lgo-budget-allocation/charts/unknown-chart"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    private void stubChart(LgoBudgetAllocationChartType chartType, String pathSegment, String label) {
        LgoBudgetAllocationChartSeries series = new LgoBudgetAllocationChartSeries(
                chartType,
                List.of(new BudgetPriorityChartDataPoint(label, null, 2L))
        );
        LgoBudgetAllocationChartSeriesResponseDto responseDto = new LgoBudgetAllocationChartSeriesResponseDto(
                pathSegment,
                List.of(new BudgetPriorityChartDataPointDto(label, null, 2L))
        );

        when(getChartDataQuery.getChart(
                any(LgoBudgetAllocationDashboardFilter.class),
                eq(chartType),
                any()
        )).thenReturn(series);
        when(restMapper.toChartResponse(series)).thenReturn(responseDto);
    }
}
