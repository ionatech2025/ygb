package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloadSessionResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.RegisterDownloadProfileRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DownloadProfileRestMapper;
import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileUseCase;
import com.ionatech.nac.ygb.application.ports.api.RegisteredDownloadSessionView;
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
@RequestMapping("/api/v1/public/download-profile")
public class DownloadProfileController {

    private final RegisterDownloadProfileUseCase registerDownloadProfileUseCase;
    private final DownloadProfileRestMapper restMapper;

    public DownloadProfileController(
            RegisterDownloadProfileUseCase registerDownloadProfileUseCase,
            DownloadProfileRestMapper restMapper
    ) {
        this.registerDownloadProfileUseCase = registerDownloadProfileUseCase;
        this.restMapper = restMapper;
    }

    @PostMapping
    public ResponseEntity<DownloadSessionResponseDto> register(
            @Valid @RequestBody RegisterDownloadProfileRequestDto request
    ) {
        RegisteredDownloadSessionView view = registerDownloadProfileUseCase.register(restMapper.toCommand(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(restMapper.toResponse(view));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleValidation(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid Download Profile");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }
}
