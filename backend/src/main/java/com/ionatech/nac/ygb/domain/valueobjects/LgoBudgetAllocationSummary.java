package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record LgoBudgetAllocationSummary(
        long totalSubmissions,
        List<LgoBudgetAllocationDistrictCount> byDistrict,
        List<LgoBudgetAllocationSectorCount> topSectors
) {
    public LgoBudgetAllocationSummary {
        if (totalSubmissions < 0) {
            throw new IllegalArgumentException("totalSubmissions must not be negative.");
        }
        byDistrict = List.copyOf(byDistrict);
        topSectors = List.copyOf(topSectors);
    }
}
