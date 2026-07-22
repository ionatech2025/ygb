package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record DistrictCountDto(String districtName, UUID districtId, long count) {}
