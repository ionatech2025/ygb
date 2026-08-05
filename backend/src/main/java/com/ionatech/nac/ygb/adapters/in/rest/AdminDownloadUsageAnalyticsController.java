package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloadUsageAggregatesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloaderPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.VisitsVsDownloadsResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DownloadUsageAnalyticsRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.application.ports.api.GetVisitsVsDownloadsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListDownloadersQuery;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin/analytics")
public class AdminDownloadUsageAnalyticsController {

    private final ListDownloadersQuery listDownloadersQuery;
    private final GetDownloadUsageAggregatesQuery getDownloadUsageAggregatesQuery;
    private final GetVisitsVsDownloadsQuery getVisitsVsDownloadsQuery;
    private final DownloadUsageAnalyticsRestMapper restMapper;

    public AdminDownloadUsageAnalyticsController(
            ListDownloadersQuery listDownloadersQuery,
            GetDownloadUsageAggregatesQuery getDownloadUsageAggregatesQuery,
            GetVisitsVsDownloadsQuery getVisitsVsDownloadsQuery,
            DownloadUsageAnalyticsRestMapper restMapper
    ) {
        this.listDownloadersQuery = listDownloadersQuery;
        this.getDownloadUsageAggregatesQuery = getDownloadUsageAggregatesQuery;
        this.getVisitsVsDownloadsQuery = getVisitsVsDownloadsQuery;
        this.restMapper = restMapper;
    }

    @GetMapping("/downloaders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DownloaderPageResponseDto> listDownloaders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String fieldOfOperation,
            @RequestParam(required = false) String dataset,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        DownloadUsageFilter filter = restMapper.toFilter(
                gender, ageGroup, countryCode, fieldOfOperation, dataset, dateFrom, dateTo
        );
        return ResponseEntity.ok(restMapper.toPageResponse(
                listDownloadersQuery.list(filter, PageRequest.of(page, size))
        ));
    }

    @GetMapping("/download-usage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DownloadUsageAggregatesResponseDto> getDownloadUsage(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String fieldOfOperation,
            @RequestParam(required = false) String dataset,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "DAY") TimeSeriesGranularity granularity
    ) {
        DownloadUsageFilter filter = restMapper.toFilter(
                gender, ageGroup, countryCode, fieldOfOperation, dataset, dateFrom, dateTo
        );
        return ResponseEntity.ok(restMapper.toAggregatesResponse(
                getDownloadUsageAggregatesQuery.getAggregates(filter, granularity)
        ));
    }

    @GetMapping("/visits-vs-downloads")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VisitsVsDownloadsResponseDto> getVisitsVsDownloads(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String fieldOfOperation,
            @RequestParam(required = false) String dataset,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "DAY") TimeSeriesGranularity granularity
    ) {
        DownloadUsageFilter filter = restMapper.toFilter(
                gender, ageGroup, countryCode, fieldOfOperation, dataset, dateFrom, dateTo
        );
        return ResponseEntity.ok(restMapper.toVisitsResponse(
                getVisitsVsDownloadsQuery.getComparison(filter, granularity)
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid Analytics Filter");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }
}
