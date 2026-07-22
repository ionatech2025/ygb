package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDatasetResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminLocationRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetAdminLocationDatasetUseCase;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

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
    public ResponseEntity<AdminLocationDatasetResponseDto> getDataset(
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        List<AdminLocation> dataset = getDatasetUseCase.getDataset();
        String etag = AdminLocationDatasetEtag.compute(dataset);

        if (Objects.equals(etag, AdminLocationDatasetEtag.normalize(ifNoneMatch))) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).eTag(etag).build();
        }

        List<AdminLocationDto> dtoList = mapper.toDtoList(dataset);
        return ResponseEntity.ok()
                .eTag(etag)
                .body(new AdminLocationDatasetResponseDto(dtoList));
    }
}
