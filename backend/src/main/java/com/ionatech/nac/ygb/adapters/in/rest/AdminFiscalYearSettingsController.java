package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.ActiveFiscalYearSettingResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SetActiveFiscalYearRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.ActiveFiscalYearSettingRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearCommand;
import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.domain.exceptions.InvalidFiscalYearSettingException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/settings/fiscal-year")
public class AdminFiscalYearSettingsController {

    private final GetActiveFiscalYearUseCase getActiveFiscalYearUseCase;
    private final SetActiveFiscalYearUseCase setActiveFiscalYearUseCase;
    private final ActiveFiscalYearSettingRestMapper restMapper;

    public AdminFiscalYearSettingsController(
            GetActiveFiscalYearUseCase getActiveFiscalYearUseCase,
            SetActiveFiscalYearUseCase setActiveFiscalYearUseCase,
            ActiveFiscalYearSettingRestMapper restMapper
    ) {
        this.getActiveFiscalYearUseCase = getActiveFiscalYearUseCase;
        this.setActiveFiscalYearUseCase = setActiveFiscalYearUseCase;
        this.restMapper = restMapper;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActiveFiscalYearSettingResponseDto> getActiveFiscalYear() {
        return ResponseEntity.ok(restMapper.toResponse(getActiveFiscalYearUseCase.getActiveFiscalYear()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActiveFiscalYearSettingResponseDto> setActiveFiscalYear(
            @Valid @RequestBody SetActiveFiscalYearRequestDto request,
            Principal principal
    ) {
        UUID adminUserId = UUID.fromString(principal.getName());
        setActiveFiscalYearUseCase.setActiveFiscalYear(
                new SetActiveFiscalYearCommand(request.fiscalYearLabel(), adminUserId)
        );
        return ResponseEntity.ok(restMapper.toResponse(getActiveFiscalYearUseCase.getActiveFiscalYear()));
    }

    @ExceptionHandler(InvalidFiscalYearSettingException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFiscalYearSetting(InvalidFiscalYearSettingException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
