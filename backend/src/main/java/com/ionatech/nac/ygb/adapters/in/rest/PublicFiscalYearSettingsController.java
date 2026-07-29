package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.ActiveFiscalYearSettingResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.ActiveFiscalYearSettingRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetActiveFiscalYearUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/settings/fiscal-year")
public class PublicFiscalYearSettingsController {

    private final GetActiveFiscalYearUseCase getActiveFiscalYearUseCase;
    private final ActiveFiscalYearSettingRestMapper restMapper;

    public PublicFiscalYearSettingsController(
            GetActiveFiscalYearUseCase getActiveFiscalYearUseCase,
            ActiveFiscalYearSettingRestMapper restMapper
    ) {
        this.getActiveFiscalYearUseCase = getActiveFiscalYearUseCase;
        this.restMapper = restMapper;
    }

    @GetMapping
    public ResponseEntity<ActiveFiscalYearSettingResponseDto> getActiveFiscalYear() {
        return ResponseEntity.ok(restMapper.toResponse(getActiveFiscalYearUseCase.getActiveFiscalYear()));
    }
}
