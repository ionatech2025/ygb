package com.ionatech.nac.ygb.domain.valueobjects;

public record LgoBudgetAllocationSectorCount(
        String sector,
        long count
) {
    public LgoBudgetAllocationSectorCount {
        if (sector == null || sector.isBlank()) {
            throw new IllegalArgumentException("sector must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("count must not be negative.");
        }
    }
}
