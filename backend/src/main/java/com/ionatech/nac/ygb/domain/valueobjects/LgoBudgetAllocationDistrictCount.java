package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

public record LgoBudgetAllocationDistrictCount(
        UUID districtId,
        String districtLabel,
        long count
) {
    public LgoBudgetAllocationDistrictCount {
        if (districtId == null) {
            throw new IllegalArgumentException("districtId must not be null.");
        }
        if (districtLabel == null || districtLabel.isBlank()) {
            throw new IllegalArgumentException("districtLabel must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("count must not be negative.");
        }
    }
}
