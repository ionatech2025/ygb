package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record CollectorBreakdownResponseDto(
        List<FormTypeCountDto> byFormType,
        List<DistrictCountDto> byDistrict
) {}
