package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record AdminLocationDatasetResponseDto(
        List<AdminLocationDto> locations
) {}
