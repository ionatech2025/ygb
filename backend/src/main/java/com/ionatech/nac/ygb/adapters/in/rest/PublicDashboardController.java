package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicDashboardFilterOptionsResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/dashboard")
public class PublicDashboardController {

    private final GetPublicDashboardFilterOptionsQuery getPublicDashboardFilterOptionsQuery;
    private final PublicDashboardFilterOptionsRestMapper filterOptionsRestMapper;
    private final AnonymisationProjector anonymisationProjector;

    public PublicDashboardController(
            GetPublicDashboardFilterOptionsQuery getPublicDashboardFilterOptionsQuery,
            PublicDashboardFilterOptionsRestMapper filterOptionsRestMapper,
            AnonymisationProjector anonymisationProjector
    ) {
        this.getPublicDashboardFilterOptionsQuery = getPublicDashboardFilterOptionsQuery;
        this.filterOptionsRestMapper = filterOptionsRestMapper;
        this.anonymisationProjector = anonymisationProjector;
    }

    @GetMapping("/filters/options")
    public ResponseEntity<PublicDashboardFilterOptionsResponseDto> getFilterOptions(
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId
    ) {
        PublicDashboardFilterOptions options = getPublicDashboardFilterOptionsQuery.getOptions(districtId, subcountyId);
        PublicDashboardFilterOptionsResponseDto response = filterOptionsRestMapper.toResponse(options);
        anonymisationProjector.assertNoPiiJsonKeys(Arrays.stream(PublicDashboardFilterOptionsResponseDto.class.getRecordComponents())
                .map(java.lang.reflect.RecordComponent::getName)
                .toList());
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
