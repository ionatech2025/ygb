package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityDashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityDashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityDashboardRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPriorityChartsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPriorityFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPrioritySummaryQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
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

@WebMvcTest(BudgetPriorityDashboardController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        AnonymisationProjector.class,
        BudgetPriorityDashboardFilterRequestMapper.class
})
class BudgetPriorityDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetBudgetPriorityFilterOptionsQuery getBudgetPriorityFilterOptionsQuery;

    @MockBean
    private GetBudgetPrioritySummaryQuery getBudgetPrioritySummaryQuery;

    @MockBean
    private GetBudgetPriorityChartsQuery getBudgetPriorityChartsQuery;

    @MockBean
    private BudgetPriorityDashboardFilterOptionsRestMapper filterOptionsRestMapper;

    @MockBean
    private BudgetPriorityDashboardRestMapper restMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnSummaryWithoutAuthentication() throws Exception {
        BudgetPrioritySummary summary = new BudgetPrioritySummary(
                2L,
                List.of(new BudgetPrioritySectionCount("health", 2L)),
                List.of(new BudgetPriorityAreaCount("PRIMARY_HEALTH_CARE", 2L))
        );
        BudgetPrioritySummaryResponseDto responseDto = new BudgetPrioritySummaryResponseDto(
                2L,
                List.of(new BudgetPrioritySectionCountDto("health", 2L)),
                List.of(new BudgetPriorityAreaCountDto("PRIMARY_HEALTH_CARE", 2L))
        );

        when(getBudgetPrioritySummaryQuery.getSummary(any(BudgetPriorityDashboardFilter.class))).thenReturn(summary);
        when(restMapper.toSummaryResponse(summary)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/public/dashboard/budget-priorities/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(2))
                .andExpect(jsonPath("$.bySection[0].section").value("health"))
                .andExpect(jsonPath("$.topPriorityAreas[0].priorityArea").value("PRIMARY_HEALTH_CARE"))
                .andExpect(jsonPath("$.phoneNumber").doesNotExist())
                .andExpect(jsonPath("$.fullName").doesNotExist())
                .andExpect(jsonPath("$.demographic_data").doesNotExist());
    }

    @Test
    void shouldFilterSummaryBySection() throws Exception {
        BudgetPrioritySummary summary = new BudgetPrioritySummary(
                1L,
                List.of(new BudgetPrioritySectionCount("health", 1L)),
                List.of()
        );
        BudgetPrioritySummaryResponseDto responseDto = new BudgetPrioritySummaryResponseDto(
                1L,
                List.of(new BudgetPrioritySectionCountDto("health", 1L)),
                List.of()
        );

        when(getBudgetPrioritySummaryQuery.getSummary(any(BudgetPriorityDashboardFilter.class))).thenReturn(summary);
        when(restMapper.toSummaryResponse(summary)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/public/dashboard/budget-priorities/summary")
                        .param("section", "health")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(1))
                .andExpect(jsonPath("$.bySection[0].section").value("health"));
    }

    @Test
    void shouldReturnChartSeriesForSupportedTypes() throws Exception {
        stubChart(BudgetPriorityChartType.BY_PRIORITY_AREA, "by-priority-area", "PRIMARY_HEALTH_CARE");
        stubChart(BudgetPriorityChartType.BY_SECTOR, "by-sector", "health");
        stubChart(BudgetPriorityChartType.OVER_TIME, "over-time", "2026-03-15");

        mockMvc.perform(get("/api/v1/public/dashboard/budget-priorities/charts/by-priority-area"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chartType").value("by-priority-area"))
                .andExpect(jsonPath("$.data[0].label").value("PRIMARY_HEALTH_CARE"));

        mockMvc.perform(get("/api/v1/public/dashboard/budget-priorities/charts/by-sector"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].label").value("health"));

        mockMvc.perform(get("/api/v1/public/dashboard/budget-priorities/charts/over-time"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].label").value("2026-03-15"));
    }

    @Test
    void shouldReturnFilterOptionsWithoutPii() throws Exception {
        UUID districtId = UUID.randomUUID();
        BudgetPriorityFilterOptions options = new BudgetPriorityFilterOptions(
                List.of("health"),
                List.of(new FilterLocationOption(districtId, "Kampala")),
                List.of(),
                List.of(),
                List.of("FEMALE"),
                List.of("AGE_20_24"),
                List.of("JAN_JUN_2026")
        );
        BudgetPriorityFilterOptionsResponseDto responseDto = new BudgetPriorityFilterOptionsResponseDto(
                List.of("health"),
                List.of(new FilterLocationOptionDto(districtId, "Kampala")),
                List.of(),
                List.of(),
                List.of("FEMALE"),
                List.of("AGE_20_24"),
                List.of("JAN_JUN_2026")
        );

        when(getBudgetPriorityFilterOptionsQuery.getOptions(null, null)).thenReturn(options);
        when(filterOptionsRestMapper.toResponse(options)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/public/dashboard/budget-priorities/filters/options"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sections[0]").value("health"))
                .andExpect(jsonPath("$.districts[0].name").value("Kampala"))
                .andExpect(jsonPath("$.phoneNumber").doesNotExist())
                .andExpect(jsonPath("$.fullName").doesNotExist());
    }

    private void stubChart(BudgetPriorityChartType chartType, String pathSegment, String label) {
        BudgetPriorityChartSeries series = new BudgetPriorityChartSeries(
                chartType,
                List.of(new BudgetPriorityChartDataPoint(
                        label,
                        chartType == BudgetPriorityChartType.OVER_TIME ? LocalDate.of(2026, 3, 15) : null,
                        2L))
        );
        BudgetPriorityChartSeriesResponseDto responseDto = new BudgetPriorityChartSeriesResponseDto(
                pathSegment,
                List.of(new BudgetPriorityChartDataPointDto(
                        label,
                        chartType == BudgetPriorityChartType.OVER_TIME ? LocalDate.of(2026, 3, 15) : null,
                        2L))
        );

        when(getBudgetPriorityChartsQuery.getChart(
                any(BudgetPriorityDashboardFilter.class),
                eq(chartType),
                any()
        )).thenReturn(series);
        when(restMapper.toChartResponse(series)).thenReturn(responseDto);
    }
}
