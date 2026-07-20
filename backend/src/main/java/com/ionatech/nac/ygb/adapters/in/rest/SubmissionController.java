package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.SubmissionRestMapper;
import com.ionatech.nac.ygb.application.ports.api.SubmitSubmissionUseCase;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException;
import com.ionatech.nac.ygb.domain.model.Submission;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {
    private final SubmitSubmissionUseCase submitUseCase;
    private final SubmissionRestMapper restMapper;
    private final com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionCountQuery countQuery;
    private final com.ionatech.nac.ygb.application.ports.api.GetCollectorSyncStatusQuery syncStatusQuery;

    public SubmissionController(
            SubmitSubmissionUseCase submitUseCase,
            SubmissionRestMapper restMapper,
            com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionCountQuery countQuery,
            com.ionatech.nac.ygb.application.ports.api.GetCollectorSyncStatusQuery syncStatusQuery
    ) {
        this.submitUseCase = submitUseCase;
        this.restMapper = restMapper;
        this.countQuery = countQuery;
        this.syncStatusQuery = syncStatusQuery;
    }

    @PostMapping
    public ResponseEntity<SubmissionResponseDto> submit(
            @Valid @RequestBody SubmissionRequestDto request,
            java.security.Principal principal
    ) {
        UUID collectorId = UUID.fromString(principal.getName());
        var command = restMapper.toCommand(request, collectorId);
        Submission submission = submitUseCase.submit(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(restMapper.toResponse(submission));
    }

    @GetMapping("/my-count")
    public ResponseEntity<Long> getMyCount(java.security.Principal principal) {
        UUID collectorId = UUID.fromString(principal.getName());
        long count = countQuery.getDailyCount(collectorId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/my-sync-status")
    public ResponseEntity<com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorSyncStatusResponseDto> getMySyncStatus(java.security.Principal principal) {
        UUID collectorId = UUID.fromString(principal.getName());
        var syncStatus = syncStatusQuery.getSyncStatus(collectorId);
        return ResponseEntity.ok(restMapper.toResponse(syncStatus));
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
