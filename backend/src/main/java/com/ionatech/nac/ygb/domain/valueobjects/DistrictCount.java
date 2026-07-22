package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

public record DistrictCount(String districtName, UUID districtId, long count) {
    public DistrictCount {
        if (districtName == null) {
            throw new IllegalArgumentException("DistrictCount districtName must not be null.");
        }
        if (districtId == null) {
            throw new IllegalArgumentException("DistrictCount districtId must not be null.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("DistrictCount count must not be negative.");
        }
    }
}
