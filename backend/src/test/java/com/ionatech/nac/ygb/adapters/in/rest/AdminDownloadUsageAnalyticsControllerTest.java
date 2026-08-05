package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.DownloadUsageAnalyticsRestMapperImpl;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.api.GetVisitsVsDownloadsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListDownloadersQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroupCount;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderSummary;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsPoint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminDownloadUsageAnalyticsController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, DownloadUsageAnalyticsRestMapperImpl.class})
class AdminDownloadUsageAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ListDownloadersQuery listDownloadersQuery;

    @MockBean
    private GetDownloadUsageAggregatesQuery getDownloadUsageAggregatesQuery;

    @MockBean
    private GetVisitsVsDownloadsQuery getVisitsVsDownloadsQuery;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnDownloadersForAdminWithAgeAndGenderFilters() throws Exception {
        UUID profileId = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        when(listDownloadersQuery.list(any(DownloadUsageFilter.class), any(PageRequest.class)))
                .thenReturn(new DownloaderPage(
                        List.of(new DownloaderSummary(
                                profileId,
                                "analyst@example.com",
                                "Ada Lovelace",
                                "UG",
                                "FEMALE",
                                "AGE_18_24",
                                "ACADEMIA_RESEARCH",
                                null,
                                LocalDateTime.parse("2026-08-01T10:00:00"),
                                3L,
                                LocalDateTime.parse("2026-08-04T12:00:00")
                        )),
                        1,
                        0,
                        25
                ));

        mockMvc.perform(get("/api/v1/admin/analytics/downloaders")
                        .param("gender", "FEMALE")
                        .param("ageGroup", "AGE_18_24")
                        .param("page", "0")
                        .param("size", "25"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].email").value("analyst@example.com"))
                .andExpect(jsonPath("$.items[0].optionalName").value("Ada Lovelace"))
                .andExpect(jsonPath("$.items[0].countryCode").value("UG"))
                .andExpect(jsonPath("$.items[0].gender").value("FEMALE"))
                .andExpect(jsonPath("$.items[0].ageGroup").value("AGE_18_24"))
                .andExpect(jsonPath("$.items[0].fieldOfOperation").value("ACADEMIA_RESEARCH"))
                .andExpect(jsonPath("$.items[0].downloadCount").value(3))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(listDownloadersQuery).list(
                eq(DownloadUsageFilter.of("FEMALE", "AGE_18_24")),
                eq(PageRequest.of(0, 25))
        );
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnDownloadUsageAggregatesWithFilters() throws Exception {
        when(getDownloadUsageAggregatesQuery.getAggregates(any(DownloadUsageFilter.class), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(new DownloadUsageAggregates(
                        2L,
                        4L,
                        List.of(new GenderCount("FEMALE", 2L)),
                        List.of(new AgeGroupCount("AGE_18_24", 2L)),
                        List.of(new DatasetDownloadCount("PDM", 3L)),
                        List.of(new TimeSeriesPoint(LocalDate.of(2026, 8, 4), 2L))
                ));

        mockMvc.perform(get("/api/v1/admin/analytics/download-usage")
                        .param("gender", "FEMALE")
                        .param("ageGroup", "AGE_18_24"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalDownloaders").value(2))
                .andExpect(jsonPath("$.totalDownloads").value(4))
                .andExpect(jsonPath("$.byGender[0].gender").value("FEMALE"))
                .andExpect(jsonPath("$.byAgeGroup[0].ageGroup").value("AGE_18_24"))
                .andExpect(jsonPath("$.byDataset[0].dataset").value("PDM"))
                .andExpect(jsonPath("$.downloadsOverTime[0].count").value(2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnVisitsVsDownloadsComparison() throws Exception {
        when(getVisitsVsDownloadsQuery.getComparison(any(DownloadUsageFilter.class), eq(TimeSeriesGranularity.WEEK)))
                .thenReturn(new VisitsVsDownloadsComparison(
                        12L,
                        5L,
                        List.of(new VisitsVsDownloadsPoint(LocalDate.of(2026, 8, 4), 7L, 3L))
                ));

        mockMvc.perform(get("/api/v1/admin/analytics/visits-vs-downloads")
                        .param("granularity", "WEEK"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUniqueVisitors").value(12))
                .andExpect(jsonPath("$.totalUniqueDownloaders").value(5))
                .andExpect(jsonPath("$.overTime[0].visitorCount").value(7))
                .andExpect(jsonPath("$.overTime[0].downloaderCount").value(3));
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldForbidNonAdminFromDownloaders() throws Exception {
        mockMvc.perform(get("/api/v1/admin/analytics/downloaders"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldForbidUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/api/v1/admin/analytics/download-usage"))
                .andExpect(status().isForbidden());
    }
}
