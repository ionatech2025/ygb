package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.LgoBudgetAllocationRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.LgoBudgetAllocationResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.LgoBudgetAllocationRestMapper;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationUseCase;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions/lgo-budget-allocation")
public class LgoBudgetAllocationController {

    private final RecordLgoBudgetAllocationUseCase recordUseCase;
    private final LgoBudgetAllocationRestMapper restMapper;

    public LgoBudgetAllocationController(
            RecordLgoBudgetAllocationUseCase recordUseCase,
            LgoBudgetAllocationRestMapper restMapper
    ) {
        this.recordUseCase = recordUseCase;
        this.restMapper = restMapper;
    }

    @PostMapping
    public ResponseEntity<LgoBudgetAllocationResponseDto> record(
            @Valid @RequestBody LgoBudgetAllocationRequestDto request,
            Principal principal
    ) {
        UUID collectorId = UUID.fromString(principal.getName());
        var result = recordUseCase.record(restMapper.toCommand(request, collectorId));
        return ResponseEntity.status(HttpStatus.CREATED).body(restMapper.toResponse(result));
    }

    @ExceptionHandler(InvalidUserOperationException.class)
    public ResponseEntity<ProblemDetail> handleForbiddenRole(InvalidUserOperationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
        problem.setTitle("Forbidden");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(problem);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleValidation(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid LGO Budget Allocation Submission");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }
}
