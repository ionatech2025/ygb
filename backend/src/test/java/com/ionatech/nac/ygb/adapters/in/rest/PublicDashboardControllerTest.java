package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.ExportPublicDatasetQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardChartQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardHeatmapQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardSummaryQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
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
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MvcResult;

import java.io.OutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicDashboardController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        AnonymisationProjector.class,
        PublicDashboardFilterRequestMapper.class
})
class PublicDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetPublicDashboardFilterOptionsQuery getPublicDashboardFilterOptionsQuery;

    @MockBean
    private GetPublicDashboardSummaryQuery getPublicDashboardSummaryQuery;

    @MockBean
    private GetPublicDashboardChartQuery getPublicDashboardChartQuery;

    @MockBean
    private GetPublicDashboardHeatmapQuery getPublicDashboardHeatmapQuery;

    @MockBean
    private ExportPublicDatasetQuery exportPublicDatasetQuery;

    @MockBean
    private PublicDashboardFilterOptionsRestMapper filterOptionsRestMapper;

    @MockBean
    private PublicDashboardRestMapper restMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnFilterOptionsWithoutAuthentication() throws Exception {
        stubFilterOptions();

        performFilterOptionsRequest()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.districts[0].name").value("Kampala"))
                .andExpect(jsonPath("$.formTypes[0]").value("BYP"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnFilterOptionsForAuthenticatedAdmin() throws Exception {
        stubFilterOptions();

        performFilterOptionsRequest()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.genders[0]").value("FEMALE"));
    }

    @Test
    void responseShouldNotContainPiiOrCollectorFields() throws Exception {
        stubFilterOptions();

        performFilterOptionsRequest()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.collectors").doesNotExist())
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.collectorName").doesNotExist())
                .andExpect(jsonPath("$.respondentName").doesNotExist());
    }

    @Test
    void shouldReturnSummaryWithoutAuthentication() throws Exception {
        UUID districtId = UUID.randomUUID();
        PublicDashboardSummary summary = new PublicDashboardSummary(
                4L,
                List.of(new FormTypeCount(FormType.BYP, 3L)),
                List.of(new GenderCount("FEMALE", 2L)),
                List.of(new FinancialYearPeriodCount("JAN_JUN_2026", 4L))
        );
        PublicSummaryResponseDto responseDto = new PublicSummaryResponseDto(
                4L,
                List.of(new FormTypeCountDto("BYP", 3L)),
                List.of(new GenderCountDto("FEMALE", 2L)),
                List.of(new FinancialYearPeriodCountDto("JAN_JUN_2026", 4L))
        );

        when(getPublicDashboardSummaryQuery.getSummary(any(PublicDashboardFilter.class))).thenReturn(summary);
        when(restMapper.toSummaryResponse(summary)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/public/dashboard/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubmissions").value(4))
                .andExpect(jsonPath("$.byFormType[0].formType").value("BYP"))
                .andExpect(jsonPath("$.byGender[0].gender").value("FEMALE"))
                .andExpect(jsonPath("$.byFinancialYearPeriod[0].financialYearPeriod").value("JAN_JUN_2026"))
                .andExpect(jsonPath("$.collectorName").doesNotExist())
                .andExpect(jsonPath("$.respondentPhone").doesNotExist());
    }

    @Test
    void shouldReturnChartSeriesForAllSupportedTypes() throws Exception {
        UUID districtId = UUID.randomUUID();
        stubChart(PublicChartType.BY_DISTRICT, new PublicChartSeries(
                PublicChartType.BY_DISTRICT,
                List.of(new PublicChartDataPoint("Kampala", districtId, null, 2L))
        ), "by-district");

        stubChart(PublicChartType.BY_GENDER, new PublicChartSeries(
                PublicChartType.BY_GENDER,
                List.of(new PublicChartDataPoint("FEMALE", null, null, 2L))
        ), "by-gender");

        stubChart(PublicChartType.BY_AGE_GROUP, new PublicChartSeries(
                PublicChartType.BY_AGE_GROUP,
                List.of(new PublicChartDataPoint("AGE_20_24", null, null, 2L))
        ), "by-age-group");

        stubChart(PublicChartType.TREND, new PublicChartSeries(
                PublicChartType.TREND,
                List.of(new PublicChartDataPoint("2026-03-15", null, LocalDate.of(2026, 3, 15), 2L))
        ), "trend");

        mockMvc.perform(get("/api/v1/public/dashboard/charts/by-district"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chartType").value("by-district"))
                .andExpect(jsonPath("$.data[0].count").value(2));

        mockMvc.perform(get("/api/v1/public/dashboard/charts/by-gender"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].label").value("FEMALE"));

        mockMvc.perform(get("/api/v1/public/dashboard/charts/by-age-group"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].label").value("AGE_20_24"));

        mockMvc.perform(get("/api/v1/public/dashboard/charts/trend"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].date").value("2026-03-15"));
    }

    @Test
    void shouldReturnHeatmapWithoutRespondentIdentifiers() throws Exception {
        UUID districtId = UUID.randomUUID();
        PublicHeatmap heatmap = new PublicHeatmap(List.of(new HeatmapEntry(districtId, null, "Kampala", 3L)));
        PublicHeatmapResponseDto responseDto = new PublicHeatmapResponseDto(
                List.of(new PublicHeatmapEntryDto(districtId, null, "Kampala", 3L))
        );

        when(getPublicDashboardHeatmapQuery.getHeatmap(any(PublicDashboardFilter.class))).thenReturn(heatmap);
        when(restMapper.toHeatmapResponse(heatmap)).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/public/dashboard/heatmap"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entries[0].districtId").value(districtId.toString()))
                .andExpect(jsonPath("$.entries[0].label").value("Kampala"))
                .andExpect(jsonPath("$.entries[0].count").value(3))
                .andExpect(jsonPath("$.entries[0].respondentName").doesNotExist())
                .andExpect(jsonPath("$.entries[0].phone").doesNotExist());
    }

    @Test
    void shouldReturnCsvDownloadWithoutAuthentication() throws Exception {
        stubExport(ExportFormat.CSV, "ID,Form Type\n");

        MvcResult asyncResult = mockMvc.perform(get("/api/v1/public/dashboard/download/csv"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(asyncResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, org.hamcrest.Matchers.containsString("text/csv")))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString("attachment")))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString(".csv")));
    }

    @Test
    void shouldReturnExcelDownloadWithoutAuthentication() throws Exception {
        stubExport(ExportFormat.XLSX, new byte[]{1, 2, 3});

        MvcResult asyncResult = mockMvc.perform(get("/api/v1/public/dashboard/download/excel"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(asyncResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, org.hamcrest.Matchers.containsString("spreadsheetml.sheet")))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString(".xlsx")));
    }

    private void stubExport(ExportFormat format, String content) throws Exception {
        doAnswer(invocation -> {
            OutputStream output = invocation.getArgument(2);
            output.write(content.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return null;
        }).when(exportPublicDatasetQuery).export(any(PublicDashboardFilter.class), eq(format), any(OutputStream.class));
    }

    private void stubExport(ExportFormat format, byte[] content) throws Exception {
        doAnswer(invocation -> {
            OutputStream output = invocation.getArgument(2);
            output.write(content);
            return null;
        }).when(exportPublicDatasetQuery).export(any(PublicDashboardFilter.class), eq(format), any(OutputStream.class));
    }

    private void stubChart(PublicChartType chartType, PublicChartSeries series, String pathSegment) {
        PublicChartSeriesResponseDto responseDto = new PublicChartSeriesResponseDto(
                pathSegment,
                List.of(new PublicChartDataPointDto(
                        series.data().getFirst().label(),
                        series.data().getFirst().locationId(),
                        series.data().getFirst().date(),
                        series.data().getFirst().count()
                ))
        );
        when(getPublicDashboardChartQuery.getChart(
                any(PublicDashboardFilter.class),
                eq(chartType),
                any(TimeSeriesGranularity.class)
        )).thenReturn(series);
        when(restMapper.toChartResponse(series)).thenReturn(responseDto);
    }

    private ResultActions performFilterOptionsRequest() throws Exception {
        return mockMvc.perform(get("/api/v1/public/dashboard/filters/options")
                .accept(MediaType.APPLICATION_JSON));
    }

    private void stubFilterOptions() {
        UUID districtId = UUID.randomUUID();
        PublicDashboardFilterOptions options = new PublicDashboardFilterOptions(
                List.of(new FilterLocationOption(districtId, "Kampala")),
                List.of(),
                List.of(),
                List.of("BYP", "IYP"),
                List.of("FEMALE"),
                List.of("AGE_20_24"),
                List.of("JAN_JUN_2026")
        );
        PublicDashboardFilterOptionsResponseDto responseDto = new PublicDashboardFilterOptionsResponseDto(
                List.of(new FilterLocationOptionDto(districtId, "Kampala")),
                List.of(),
                List.of(),
                List.of("BYP", "IYP"),
                List.of("FEMALE"),
                List.of("AGE_20_24"),
                List.of("JAN_JUN_2026")
        );

        when(getPublicDashboardFilterOptionsQuery.getOptions(isNull(), isNull())).thenReturn(options);
        when(filterOptionsRestMapper.toResponse(options)).thenReturn(responseDto);
    }
}
