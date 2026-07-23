package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.LgoBudgetAllocationDashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.LgoBudgetAllocationDashboardRestMapper;
import com.ionatech.nac.ygb.application.ports.api.ExportLgoBudgetAllocationDatasetUseCase;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationChartDataQuery;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationDashboardSummaryQuery;
import com.ionatech.nac.ygb.application.ports.api.GetLgoBudgetAllocationFilterOptionsQuery;
import com.ionatech.nac.ygb.adapters.out.export.LgoBudgetAllocationExportFilenameBuilder;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/dashboard/lgo-budget-allocation")
public class LgoBudgetAllocationDashboardController {

    private final GetLgoBudgetAllocationFilterOptionsQuery getFilterOptionsQuery;
    private final GetLgoBudgetAllocationDashboardSummaryQuery getSummaryQuery;
    private final GetLgoBudgetAllocationChartDataQuery getChartDataQuery;
    private final ExportLgoBudgetAllocationDatasetUseCase exportLgoBudgetAllocationDatasetUseCase;
    private final LgoBudgetAllocationDashboardFilterRequestMapper filterRequestMapper;
    private final LgoBudgetAllocationDashboardRestMapper restMapper;
    private final AnonymisationProjector anonymisationProjector;

    public LgoBudgetAllocationDashboardController(
            GetLgoBudgetAllocationFilterOptionsQuery getFilterOptionsQuery,
            GetLgoBudgetAllocationDashboardSummaryQuery getSummaryQuery,
            GetLgoBudgetAllocationChartDataQuery getChartDataQuery,
            ExportLgoBudgetAllocationDatasetUseCase exportLgoBudgetAllocationDatasetUseCase,
            LgoBudgetAllocationDashboardFilterRequestMapper filterRequestMapper,
            LgoBudgetAllocationDashboardRestMapper restMapper,
            AnonymisationProjector anonymisationProjector
    ) {
        this.getFilterOptionsQuery = getFilterOptionsQuery;
        this.getSummaryQuery = getSummaryQuery;
        this.getChartDataQuery = getChartDataQuery;
        this.exportLgoBudgetAllocationDatasetUseCase = exportLgoBudgetAllocationDatasetUseCase;
        this.filterRequestMapper = filterRequestMapper;
        this.restMapper = restMapper;
        this.anonymisationProjector = anonymisationProjector;
    }

    @GetMapping("/filters/options")
    public ResponseEntity<LgoBudgetAllocationFilterOptionsResponseDto> getFilterOptions(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId
    ) {
        LgoBudgetAllocationFilterOptions options = getFilterOptionsQuery.getOptions(districtId, subcountyId);
        LgoBudgetAllocationFilterOptionsResponseDto response = restMapper.toFilterOptionsResponse(options);
        assertNoPii(LgoBudgetAllocationFilterOptionsResponseDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<LgoBudgetAllocationSummaryResponseDto> getSummary(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod
    ) {
        LgoBudgetAllocationDashboardFilter filter = filterRequestMapper.toFilter(
                districtId, subcountyId, parishId, dateFrom, dateTo, gender, ageGroup, financialYearPeriod
        );
        LgoBudgetAllocationSummary summary = getSummaryQuery.getSummary(filter);
        LgoBudgetAllocationSummaryResponseDto response = restMapper.toSummaryResponse(summary);
        assertNoPii(LgoBudgetAllocationSummaryResponseDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/charts/{chartType}")
    public ResponseEntity<LgoBudgetAllocationChartSeriesResponseDto> getChart(
            @PathVariable("chartType") String chartType,
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod,
            @RequestParam(value = "granularity", defaultValue = "DAY") TimeSeriesGranularity granularity
    ) {
        LgoBudgetAllocationDashboardFilter filter = filterRequestMapper.toFilter(
                districtId, subcountyId, parishId, dateFrom, dateTo, gender, ageGroup, financialYearPeriod
        );
        LgoBudgetAllocationChartSeries series = getChartDataQuery.getChart(
                filter,
                LgoBudgetAllocationChartType.fromPath(chartType),
                granularity
        );
        LgoBudgetAllocationChartSeriesResponseDto response = restMapper.toChartResponse(series);
        assertNoPii(LgoBudgetAllocationChartSeriesResponseDto.class);
        assertNoPii(BudgetPriorityChartDataPointDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/csv")
    public ResponseEntity<StreamingResponseBody> downloadCsv(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod
    ) {
        LgoBudgetAllocationDashboardFilter filter = filterRequestMapper.toFilter(
                districtId, subcountyId, parishId, dateFrom, dateTo, gender, ageGroup, financialYearPeriod
        );
        anonymisationProjector.assertLgoBudgetAllocationExportHeadersSafe();
        StreamingResponseBody body = output -> exportLgoBudgetAllocationDatasetUseCase.export(filter, output);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                        + LgoBudgetAllocationExportFilenameBuilder.build() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
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
