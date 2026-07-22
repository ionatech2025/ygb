package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DashboardAggregatesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DashboardFilterOptionsResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetDashboardAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.api.GetDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilterOptions;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    private final GetDashboardAggregatesQuery getDashboardAggregatesQuery;
    private final GetDashboardFilterOptionsQuery getDashboardFilterOptionsQuery;
    private final DashboardFilterRequestMapper filterMapper;
    private final DashboardRestMapper restMapper;
    private final DashboardFilterOptionsRestMapper filterOptionsRestMapper;

    public AdminDashboardController(
            GetDashboardAggregatesQuery getDashboardAggregatesQuery,
            GetDashboardFilterOptionsQuery getDashboardFilterOptionsQuery,
            DashboardFilterRequestMapper filterMapper,
            DashboardRestMapper restMapper,
            DashboardFilterOptionsRestMapper filterOptionsRestMapper
    ) {
        this.getDashboardAggregatesQuery = getDashboardAggregatesQuery;
        this.getDashboardFilterOptionsQuery = getDashboardFilterOptionsQuery;
        this.filterMapper = filterMapper;
        this.restMapper = restMapper;
        this.filterOptionsRestMapper = filterOptionsRestMapper;
    }

    /**
     * Query params (all optional, combined with AND logic):
     * districtId, subcountyId, parishId, formType, dateFrom, dateTo,
     * gender, ageGroup, collectorId, financialYearPeriod, granularity (DAY|WEEK).
     */
    @GetMapping("/aggregates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardAggregatesResponseDto> getAggregates(
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId,
            @RequestParam(required = false) UUID parishId,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) UUID collectorId,
            @RequestParam(required = false) String financialYearPeriod,
            @RequestParam(defaultValue = "DAY") TimeSeriesGranularity granularity
    ) {
        var filter = filterMapper.toFilter(
                districtId,
                subcountyId,
                parishId,
                formType,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                collectorId,
                financialYearPeriod
        );
        DashboardAggregates aggregates = getDashboardAggregatesQuery.getAggregates(filter, granularity);
        return ResponseEntity.ok(restMapper.toResponse(aggregates));
    }

    @GetMapping("/filters/options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardFilterOptionsResponseDto> getFilterOptions(
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId
    ) {
        DashboardFilterOptions options = getDashboardFilterOptionsQuery.getOptions(districtId, subcountyId);
        return ResponseEntity.ok(filterOptionsRestMapper.toResponse(options));
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
