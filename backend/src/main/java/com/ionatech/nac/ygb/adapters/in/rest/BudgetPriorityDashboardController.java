package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPriorityChartDataPointDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPriorityChartSeriesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPriorityFilterOptionsResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPrioritySummaryResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityDashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityDashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityDashboardRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPriorityChartsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPriorityFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetBudgetPrioritySummaryQuery;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartSeries;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartType;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityFilterOptions;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPrioritySummary;
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
@RequestMapping("/api/v1/public/dashboard/budget-priorities")
public class BudgetPriorityDashboardController {

    private final GetBudgetPriorityFilterOptionsQuery getBudgetPriorityFilterOptionsQuery;
    private final GetBudgetPrioritySummaryQuery getBudgetPrioritySummaryQuery;
    private final GetBudgetPriorityChartsQuery getBudgetPriorityChartsQuery;
    private final BudgetPriorityDashboardFilterRequestMapper filterRequestMapper;
    private final BudgetPriorityDashboardFilterOptionsRestMapper filterOptionsRestMapper;
    private final BudgetPriorityDashboardRestMapper restMapper;
    private final AnonymisationProjector anonymisationProjector;

    public BudgetPriorityDashboardController(
            GetBudgetPriorityFilterOptionsQuery getBudgetPriorityFilterOptionsQuery,
            GetBudgetPrioritySummaryQuery getBudgetPrioritySummaryQuery,
            GetBudgetPriorityChartsQuery getBudgetPriorityChartsQuery,
            BudgetPriorityDashboardFilterRequestMapper filterRequestMapper,
            BudgetPriorityDashboardFilterOptionsRestMapper filterOptionsRestMapper,
            BudgetPriorityDashboardRestMapper restMapper,
            AnonymisationProjector anonymisationProjector
    ) {
        this.getBudgetPriorityFilterOptionsQuery = getBudgetPriorityFilterOptionsQuery;
        this.getBudgetPrioritySummaryQuery = getBudgetPrioritySummaryQuery;
        this.getBudgetPriorityChartsQuery = getBudgetPriorityChartsQuery;
        this.filterRequestMapper = filterRequestMapper;
        this.filterOptionsRestMapper = filterOptionsRestMapper;
        this.restMapper = restMapper;
        this.anonymisationProjector = anonymisationProjector;
    }

    @GetMapping("/filters/options")
    public ResponseEntity<BudgetPriorityFilterOptionsResponseDto> getFilterOptions(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId
    ) {
        BudgetPriorityFilterOptions options = getBudgetPriorityFilterOptionsQuery.getOptions(districtId, subcountyId);
        BudgetPriorityFilterOptionsResponseDto response = filterOptionsRestMapper.toResponse(options);
        assertNoPii(BudgetPriorityFilterOptionsResponseDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<BudgetPrioritySummaryResponseDto> getSummary(
            @RequestParam(value = "section", required = false) String section,
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod
    ) {
        BudgetPriorityDashboardFilter filter = filterRequestMapper.toFilter(
                section, districtId, subcountyId, parishId, dateFrom, dateTo,
                gender, ageGroup, financialYearPeriod
        );
        BudgetPrioritySummary summary = getBudgetPrioritySummaryQuery.getSummary(filter);
        BudgetPrioritySummaryResponseDto response = restMapper.toSummaryResponse(summary);
        assertNoPii(BudgetPrioritySummaryResponseDto.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/charts/{chartType}")
    public ResponseEntity<BudgetPriorityChartSeriesResponseDto> getChart(
            @PathVariable("chartType") String chartType,
            @RequestParam(value = "section", required = false) String section,
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
        BudgetPriorityDashboardFilter filter = filterRequestMapper.toFilter(
                section, districtId, subcountyId, parishId, dateFrom, dateTo,
                gender, ageGroup, financialYearPeriod
        );
        BudgetPriorityChartSeries series = getBudgetPriorityChartsQuery.getChart(
                filter,
                BudgetPriorityChartType.fromPath(chartType),
                granularity
        );
        BudgetPriorityChartSeriesResponseDto response = restMapper.toChartResponse(series);
        assertNoPii(BudgetPriorityChartSeriesResponseDto.class);
        assertNoPii(BudgetPriorityChartDataPointDto.class);
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
