package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DatasetDownloadCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicDownloadUsageAggregatesResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.TimeSeriesPointDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDownloadUsageRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDownloadUsageAggregatesQuery;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/public/dashboard/download-usage")
public class PublicDownloadUsageController {

    private final GetPublicDownloadUsageAggregatesQuery getPublicDownloadUsageAggregatesQuery;
    private final PublicDownloadUsageRestMapper restMapper;
    private final AnonymisationProjector anonymisationProjector;

    public PublicDownloadUsageController(
            GetPublicDownloadUsageAggregatesQuery getPublicDownloadUsageAggregatesQuery,
            PublicDownloadUsageRestMapper restMapper,
            AnonymisationProjector anonymisationProjector
    ) {
        this.getPublicDownloadUsageAggregatesQuery = getPublicDownloadUsageAggregatesQuery;
        this.restMapper = restMapper;
        this.anonymisationProjector = anonymisationProjector;
    }

    @GetMapping
    public ResponseEntity<PublicDownloadUsageAggregatesResponseDto> getDownloadUsage(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "DAY") TimeSeriesGranularity granularity
    ) {
        PublicDownloadUsageAggregatesResponseDto response = restMapper.toResponse(
                getPublicDownloadUsageAggregatesQuery.getAggregates(dateFrom, dateTo, granularity)
        );
        assertNoPii(PublicDownloadUsageAggregatesResponseDto.class);
        assertNoPii(DatasetDownloadCountDto.class);
        assertNoPii(TimeSeriesPointDto.class);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid Download Usage Filter");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    private void assertNoPii(Class<?> dtoClass) {
        anonymisationProjector.assertNoPiiJsonKeys(Arrays.stream(dtoClass.getRecordComponents())
                .map(java.lang.reflect.RecordComponent::getName)
                .toList());
    }
}
