package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetDashboardAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.model.FormType;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminDashboardController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, DashboardFilterRequestMapper.class})
class AdminDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetDashboardAggregatesQuery getDashboardAggregatesQuery;

    @MockBean
    private DashboardRestMapper dashboardRestMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnAggregatesForAdmin() throws Exception {
        UUID districtId = UUID.randomUUID();
        DashboardAggregates aggregates = new DashboardAggregates(
                4L,
                List.of(new DistrictCount("Arua", districtId, 4L)),
                List.of(new GenderCount("FEMALE", 2L), new GenderCount("MALE", 2L)),
                List.of(new TimeSeriesPoint(LocalDate.of(2026, 3, 15), 4L)),
                List.of(new FormTypeCount(FormType.BYP, 3L), new FormTypeCount(FormType.IYP, 1L)),
                List.of(new FinancialYearPeriodCount("JAN_JUN_2026", 4L))
        );
        DashboardAggregatesResponseDto responseDto = new DashboardAggregatesResponseDto(
                4L,
                List.of(new DistrictCountDto("Arua", districtId, 4L)),
                List.of(new GenderCountDto("FEMALE", 2L), new GenderCountDto("MALE", 2L)),
                List.of(new TimeSeriesPointDto(LocalDate.of(2026, 3, 15), 4L)),
                List.of(new FormTypeCountDto("BYP", 3L), new FormTypeCountDto("IYP", 1L)),
                List.of(new FinancialYearPeriodCountDto("JAN_JUN_2026", 4L))
        );

        when(getDashboardAggregatesQuery.getAggregates(any(DashboardFilter.class), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(aggregates);
        when(dashboardRestMapper.toResponse(aggregates)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/admin/dashboard/aggregates")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(4))
                .andExpect(jsonPath("$.byDistrict[0].districtName").value("Arua"))
                .andExpect(jsonPath("$.byGender[0].gender").value("FEMALE"))
                .andExpect(jsonPath("$.byFormType[0].formType").value("BYP"))
                .andExpect(jsonPath("$.byFinancialYearPeriod[0].financialYearPeriod").value("JAN_JUN_2026"));

        verify(getDashboardAggregatesQuery).getAggregates(any(DashboardFilter.class), eq(TimeSeriesGranularity.DAY));
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldReturnForbiddenForDataCollector() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/aggregates"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnForbiddenWhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/aggregates"))
                .andExpect(status().isForbidden());
    }
}
