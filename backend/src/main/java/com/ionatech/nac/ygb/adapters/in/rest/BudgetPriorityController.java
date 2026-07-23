package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPrioritySubmissionRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPrioritySubmissionResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.BudgetPriorityRestMapper;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityUseCase;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/budget-priorities")
public class BudgetPriorityController {

    private final SubmitBudgetPriorityUseCase submitUseCase;
    private final BudgetPriorityRestMapper restMapper;

    public BudgetPriorityController(
            SubmitBudgetPriorityUseCase submitUseCase,
            BudgetPriorityRestMapper restMapper
    ) {
        this.submitUseCase = submitUseCase;
        this.restMapper = restMapper;
    }

    @PostMapping("/{section}")
    public ResponseEntity<BudgetPrioritySubmissionResponseDto> submit(
            @PathVariable String section,
            @Valid @RequestBody BudgetPrioritySubmissionRequestDto request
    ) {
        BudgetPrioritySection parsedSection = BudgetPrioritySection.fromApiSegment(section);
        BudgetPrioritySubmission submission = submitUseCase.submit(restMapper.toCommand(parsedSection, request));
        return ResponseEntity.status(HttpStatus.CREATED).body(restMapper.toResponse(submission));
    }

    @ExceptionHandler(DuplicateBudgetPrioritySubmissionException.class)
    public ResponseEntity<ProblemDetail> handleDuplicate(DuplicateBudgetPrioritySubmissionException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Duplicate Budget Priority Submission");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleValidation(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid Budget Priority Submission");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }
}
