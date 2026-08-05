package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDownloadUsageRestMapperImpl;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicDownloadUsageController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        PublicDownloadUsageRestMapperImpl.class,
        AnonymisationProjector.class
})
class PublicDownloadUsageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetPublicDownloadUsageAggregatesQuery getPublicDownloadUsageAggregatesQuery;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnDownloadUsageWithoutAuthentication() throws Exception {
        when(getPublicDownloadUsageAggregatesQuery.getAggregates(isNull(), isNull(), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(new PublicDownloadUsageAggregates(
                        6L,
                        List.of(
                                new DatasetDownloadCount("PDM", 3L),
                                new DatasetDownloadCount("BUDGET_PRIORITIES", 2L),
                                new DatasetDownloadCount("LGO_BUDGET_ALLOCATION", 1L)
                        ),
                        List.of(new TimeSeriesPoint(LocalDate.of(2026, 8, 4), 6L))
                ));

        mockMvc.perform(get("/api/v1/public/dashboard/download-usage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalDownloads").value(6))
                .andExpect(jsonPath("$.byDataset[0].dataset").value("PDM"))
                .andExpect(jsonPath("$.byDataset[0].count").value(3))
                .andExpect(jsonPath("$.byDataset[1].dataset").value("BUDGET_PRIORITIES"))
                .andExpect(jsonPath("$.byDataset[2].dataset").value("LGO_BUDGET_ALLOCATION"))
                .andExpect(jsonPath("$.downloadsOverTime[0].bucketStart").value("2026-08-04"))
                .andExpect(jsonPath("$.downloadsOverTime[0].count").value(6))
                .andExpect(jsonPath("$.email").doesNotExist())
                .andExpect(jsonPath("$.optionalName").doesNotExist())
                .andExpect(jsonPath("$.name").doesNotExist())
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.byGender").doesNotExist())
                .andExpect(jsonPath("$.byAgeGroup").doesNotExist());

        verify(getPublicDownloadUsageAggregatesQuery).getAggregates(null, null, TimeSeriesGranularity.DAY);
    }

    @Test
    void shouldPassDateRangeAndWeekGranularity() throws Exception {
        when(getPublicDownloadUsageAggregatesQuery.getAggregates(
                eq(LocalDate.of(2026, 8, 1)),
                eq(LocalDate.of(2026, 8, 31)),
                eq(TimeSeriesGranularity.WEEK)
        )).thenReturn(new PublicDownloadUsageAggregates(0L, List.of(), List.of()));

        mockMvc.perform(get("/api/v1/public/dashboard/download-usage")
                        .param("dateFrom", "2026-08-01")
                        .param("dateTo", "2026-08-31")
                        .param("granularity", "WEEK"))
                .andExpect(status().isOk());
    }
}
