package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDatasetResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminLocationRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetAdminLocationDatasetUseCase;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
public class AdminLocationController {

    private final GetAdminLocationDatasetUseCase getDatasetUseCase;
    private final AdminLocationRestMapper mapper;

    public AdminLocationController(GetAdminLocationDatasetUseCase getDatasetUseCase, AdminLocationRestMapper mapper) {
        this.getDatasetUseCase = getDatasetUseCase;
        this.mapper = mapper;
    }

    @GetMapping("/dataset")
    public ResponseEntity<AdminLocationDatasetResponseDto> getDataset() {
        List<AdminLocation> dataset = getDatasetUseCase.getDataset();
        List<AdminLocationDto> dtoList = mapper.toDtoList(dataset);
        return ResponseEntity.ok(new AdminLocationDatasetResponseDto(dtoList));
    }
}
