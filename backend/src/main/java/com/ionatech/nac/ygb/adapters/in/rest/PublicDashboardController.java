package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicChartDataPointDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicChartSeriesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicDashboardFilterOptionsResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicHeatmapEntryDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicHeatmapResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicSummaryResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardChartQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardHeatmapQuery;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardSummaryQuery;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.PublicChartSeries;
import com.ionatech.nac.ygb.domain.valueobjects.PublicChartType;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardSummary;
import com.ionatech.nac.ygb.domain.valueobjects.PublicHeatmap;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/dashboard")
public class PublicDashboardController {

    private final GetPublicDashboardFilterOptionsQuery getPublicDashboardFilterOptionsQuery;
    private final GetPublicDashboardSummaryQuery getPublicDashboardSummaryQuery;
    private final GetPublicDashboardChartQuery getPublicDashboardChartQuery;
    private final GetPublicDashboardHeatmapQuery getPublicDashboardHeatmapQuery;
    private final PublicDashboardFilterRequestMapper filterRequestMapper;
    private final PublicDashboardFilterOptionsRestMapper filterOptionsRestMapper;
    private final PublicDashboardRestMapper restMapper;
    private final AnonymisationProjector anonymisationProjector;

    public PublicDashboardController(
            GetPublicDashboardFilterOptionsQuery getPublicDashboardFilterOptionsQuery,
            GetPublicDashboardSummaryQuery getPublicDashboardSummaryQuery,
            GetPublicDashboardChartQuery getPublicDashboardChartQuery,
            GetPublicDashboardHeatmapQuery getPublicDashboardHeatmapQuery,
            PublicDashboardFilterRequestMapper filterRequestMapper,
            PublicDashboardFilterOptionsRestMapper filterOptionsRestMapper,
            PublicDashboardRestMapper restMapper,
            AnonymisationProjector anonymisationProjector
    ) {
        this.getPublicDashboardFilterOptionsQuery = getPublicDashboardFilterOptionsQuery;
        this.getPublicDashboardSummaryQuery = getPublicDashboardSummaryQuery;
        this.getPublicDashboardChartQuery = getPublicDashboardChartQuery;
        this.getPublicDashboardHeatmapQuery = getPublicDashboardHeatmapQuery;
        this.filterRequestMapper = filterRequestMapper;
        this.filterOptionsRestMapper = filterOptionsRestMapper;
        this.restMapper = restMapper;
        this.anonymisationProjector = anonymisationProjector;
    }

    @GetMapping("/filters/options")
    public ResponseEntity<PublicDashboardFilterOptionsResponseDto> getFilterOptions(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId
    ) {
        PublicDashboardFilterOptions options = getPublicDashboardFilterOptionsQuery.getOptions(districtId, subcountyId);
        PublicDashboardFilterOptionsResponseDto response = filterOptionsRestMapper.toResponse(options);
        assertNoPii(PublicDashboardFilterOptionsResponseDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<PublicSummaryResponseDto> getSummary(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "formType", required = false) FormType formType,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod,
            @RequestParam(value = "programmeArea", required = false) String programmeArea
    ) {
        PublicDashboardFilter filter = filterRequestMapper.toFilter(
                districtId, subcountyId, parishId, formType, dateFrom, dateTo,
                gender, ageGroup, financialYearPeriod, programmeArea
        );
        PublicDashboardSummary summary = getPublicDashboardSummaryQuery.getSummary(filter);
        PublicSummaryResponseDto response = restMapper.toSummaryResponse(summary);
        assertNoPii(PublicSummaryResponseDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/charts/{chartType}")
    public ResponseEntity<PublicChartSeriesResponseDto> getChart(
            @PathVariable("chartType") String chartType,
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "formType", required = false) FormType formType,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod,
            @RequestParam(value = "programmeArea", required = false) String programmeArea,
            @RequestParam(value = "granularity", defaultValue = "DAY") TimeSeriesGranularity granularity
    ) {
        PublicDashboardFilter filter = filterRequestMapper.toFilter(
                districtId, subcountyId, parishId, formType, dateFrom, dateTo,
                gender, ageGroup, financialYearPeriod, programmeArea
        );
        PublicChartSeries series = getPublicDashboardChartQuery.getChart(
                filter,
                PublicChartType.fromPath(chartType),
                granularity
        );
        PublicChartSeriesResponseDto response = restMapper.toChartResponse(series);
        assertNoPii(PublicChartSeriesResponseDto.class);
        assertNoPii(PublicChartDataPointDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/heatmap")
    public ResponseEntity<PublicHeatmapResponseDto> getHeatmap(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "formType", required = false) FormType formType,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod,
            @RequestParam(value = "programmeArea", required = false) String programmeArea
    ) {
        PublicDashboardFilter filter = filterRequestMapper.toFilter(
                districtId, subcountyId, parishId, formType, dateFrom, dateTo,
                gender, ageGroup, financialYearPeriod, programmeArea
        );
        PublicHeatmap heatmap = getPublicDashboardHeatmapQuery.getHeatmap(filter);
        PublicHeatmapResponseDto response = restMapper.toHeatmapResponse(heatmap);
        assertNoPii(PublicHeatmapResponseDto.class);
        assertNoPii(PublicHeatmapEntryDto.class);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    private void assertNoPii(Class<?> dtoClass) {
        anonymisationProjector.assertNoPiiJsonKeys(Arrays.stream(dtoClass.getRecordComponents())
                .map(java.lang.reflect.RecordComponent::getName)
                .toList());
    }
}
