package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DashboardAggregatesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetDashboardAggregatesQuery;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    private final GetDashboardAggregatesQuery getDashboardAggregatesQuery;
    private final DashboardFilterRequestMapper filterMapper;
    private final DashboardRestMapper restMapper;

    public AdminDashboardController(
            GetDashboardAggregatesQuery getDashboardAggregatesQuery,
            DashboardFilterRequestMapper filterMapper,
            DashboardRestMapper restMapper
    ) {
        this.getDashboardAggregatesQuery = getDashboardAggregatesQuery;
        this.filterMapper = filterMapper;
        this.restMapper = restMapper;
    }

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
}
