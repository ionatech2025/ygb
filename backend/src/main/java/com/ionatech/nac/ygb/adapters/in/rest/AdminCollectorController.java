package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorBreakdownResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorLeaderboardEntryDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.CollectorTrackerRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorBreakdownQuery;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorLeaderboardQuery;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/collectors")
public class AdminCollectorController {

    private final GetCollectorLeaderboardQuery getCollectorLeaderboardQuery;
    private final GetCollectorBreakdownQuery getCollectorBreakdownQuery;
    private final DashboardFilterRequestMapper filterMapper;
    private final CollectorTrackerRestMapper restMapper;

    public AdminCollectorController(
            GetCollectorLeaderboardQuery getCollectorLeaderboardQuery,
            GetCollectorBreakdownQuery getCollectorBreakdownQuery,
            DashboardFilterRequestMapper filterMapper,
            CollectorTrackerRestMapper restMapper
    ) {
        this.getCollectorLeaderboardQuery = getCollectorLeaderboardQuery;
        this.getCollectorBreakdownQuery = getCollectorBreakdownQuery;
        this.filterMapper = filterMapper;
        this.restMapper = restMapper;
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CollectorLeaderboardEntryDto>> getLeaderboard(
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId,
            @RequestParam(required = false) UUID parishId,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) UUID collectorId,
            @RequestParam(required = false) String financialYearPeriod
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
        List<CollectorLeaderboardEntry> entries = getCollectorLeaderboardQuery.getLeaderboard(filter);
        return ResponseEntity.ok(restMapper.toLeaderboardResponse(entries));
    }

    @GetMapping("/{id}/breakdown")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CollectorBreakdownResponseDto> getBreakdown(
            @PathVariable UUID id,
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId,
            @RequestParam(required = false) UUID parishId,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String financialYearPeriod
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
                null,
                financialYearPeriod
        );
        CollectorBreakdown breakdown = getCollectorBreakdownQuery.getBreakdown(id, filter);
        return ResponseEntity.ok(restMapper.toBreakdownResponse(breakdown));
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
