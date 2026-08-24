package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorBreakdownResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorSyncStatusResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.CollectorTrackerRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.SubmissionRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorBreakdownQuery;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionCountQuery;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorSyncStatusQuery;
import com.ionatech.nac.ygb.application.ports.api.SubmitSubmissionUseCase;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {
    private final SubmitSubmissionUseCase submitUseCase;
    private final SubmissionRestMapper restMapper;
    private final GetCollectorSubmissionCountQuery countQuery;
    private final GetCollectorSyncStatusQuery syncStatusQuery;
    private final GetCollectorSubmissionsQuery collectorSubmissionsQuery;
    private final GetCollectorBreakdownQuery collectorBreakdownQuery;
    private final DashboardFilterRequestMapper filterMapper;
    private final AdminSubmissionRestMapper submissionListMapper;
    private final CollectorTrackerRestMapper collectorTrackerMapper;

    public SubmissionController(
            SubmitSubmissionUseCase submitUseCase,
            SubmissionRestMapper restMapper,
            GetCollectorSubmissionCountQuery countQuery,
            GetCollectorSyncStatusQuery syncStatusQuery,
            GetCollectorSubmissionsQuery collectorSubmissionsQuery,
            GetCollectorBreakdownQuery collectorBreakdownQuery,
            DashboardFilterRequestMapper filterMapper,
            AdminSubmissionRestMapper submissionListMapper,
            CollectorTrackerRestMapper collectorTrackerMapper
    ) {
        this.submitUseCase = submitUseCase;
        this.restMapper = restMapper;
        this.countQuery = countQuery;
        this.syncStatusQuery = syncStatusQuery;
        this.collectorSubmissionsQuery = collectorSubmissionsQuery;
        this.collectorBreakdownQuery = collectorBreakdownQuery;
        this.filterMapper = filterMapper;
        this.submissionListMapper = submissionListMapper;
        this.collectorTrackerMapper = collectorTrackerMapper;
    }

    @PostMapping
    public ResponseEntity<SubmissionResponseDto> submit(
            @Valid @RequestBody SubmissionRequestDto request,
            Principal principal
    ) {
        UUID collectorId = UUID.fromString(principal.getName());
        var command = restMapper.toCommand(request, collectorId);
        Submission submission = submitUseCase.submit(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(restMapper.toResponse(submission));
    }

    @GetMapping("/my-count")
    public ResponseEntity<Long> getMyCount(Principal principal) {
        UUID collectorId = UUID.fromString(principal.getName());
        long count = countQuery.getDailyCount(collectorId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/my-sync-status")
    public ResponseEntity<CollectorSyncStatusResponseDto> getMySyncStatus(Principal principal) {
        UUID collectorId = UUID.fromString(principal.getName());
        var syncStatus = syncStatusQuery.getSyncStatus(collectorId);
        return ResponseEntity.ok(restMapper.toResponse(syncStatus));
    }

    @GetMapping("/mine")
    public ResponseEntity<SubmissionPageResponseDto> getMySubmissions(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String financialYearPeriod
    ) {
        UUID collectorId = UUID.fromString(principal.getName());
        DashboardFilter filter = ownSubmissionFilter(formType, dateFrom, dateTo, financialYearPeriod);
        SubmissionPage submissionPage = collectorSubmissionsQuery.getSubmissions(
                collectorId,
                filter,
                PageRequest.of(page, size)
        );
        return ResponseEntity.ok(submissionListMapper.toResponse(submissionPage));
    }

    @GetMapping("/mine/breakdown")
    public ResponseEntity<CollectorBreakdownResponseDto> getMySubmissionBreakdown(
            Principal principal,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String financialYearPeriod
    ) {
        UUID collectorId = UUID.fromString(principal.getName());
        DashboardFilter filter = ownSubmissionFilter(formType, dateFrom, dateTo, financialYearPeriod);
        CollectorBreakdown breakdown = collectorBreakdownQuery.getBreakdown(collectorId, filter);
        return ResponseEntity.ok(collectorTrackerMapper.toBreakdownResponse(breakdown));
    }

    private DashboardFilter ownSubmissionFilter(
            FormType formType,
            LocalDate dateFrom,
            LocalDate dateTo,
            String financialYearPeriod
    ) {
        return filterMapper.toFilter(
                null,
                null,
                null,
                formType,
                dateFrom,
                dateTo,
                null,
                null,
                null,
                financialYearPeriod
        );
    }

    @ExceptionHandler(DuplicateSyncedSubmissionException.class)
    public ResponseEntity<String> handleDuplicateSyncedSubmission(DuplicateSyncedSubmissionException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
