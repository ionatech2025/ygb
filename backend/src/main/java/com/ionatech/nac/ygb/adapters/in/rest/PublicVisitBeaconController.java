package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicVisitBeaconRequestDto;
import com.ionatech.nac.ygb.application.ports.api.RecordPublicVisitUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/analytics")
public class PublicVisitBeaconController {

    private final RecordPublicVisitUseCase recordPublicVisitUseCase;

    public PublicVisitBeaconController(RecordPublicVisitUseCase recordPublicVisitUseCase) {
        this.recordPublicVisitUseCase = recordPublicVisitUseCase;
    }

    @PostMapping("/visit")
    public ResponseEntity<Void> recordVisit(@Valid @RequestBody PublicVisitBeaconRequestDto request) {
        recordPublicVisitUseCase.record(request.anonymousSessionId(), request.routeGroup());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleValidation(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid Visit Beacon");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }
}
