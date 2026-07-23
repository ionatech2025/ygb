package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.Map;
import java.util.Objects;

/**
 * Prior financial year sector allocation breakdown (LGO-02).
 * Stored as JSONB — each key is a sector slug; value is amount, percentage, or nested detail map.
 */
public final class PriorYearAllocationBreakdown {

    private final Map<String, Object> sectors;

    public PriorYearAllocationBreakdown(Map<String, Object> sectors) {
        this.sectors = Map.copyOf(validate(sectors));
    }

    public static Map<String, Object> validate(Map<String, Object> sectors) {
        if (sectors == null || sectors.isEmpty()) {
            throw new IllegalArgumentException("Previous FY allocations must include at least one sector");
        }
        for (Map.Entry<String, Object> entry : sectors.entrySet()) {
            if (entry.getKey() == null || entry.getKey().isBlank()) {
                throw new IllegalArgumentException("Sector name cannot be blank");
            }
            if (entry.getValue() == null) {
                throw new IllegalArgumentException("Sector allocation cannot be null");
            }
        }
        return sectors;
    }

    public Map<String, Object> asMap() {
        return sectors;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof PriorYearAllocationBreakdown that)) {
            return false;
        }
        return Objects.equals(sectors, that.sectors);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sectors);
    }
}
