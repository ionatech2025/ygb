package com.ionatech.nac.ygb.domain.valueobjects;

public enum LgoBudgetAllocationChartType {
    BY_DISTRICT("by-district"),
    BY_SECTOR("by-sector"),
    OVER_TIME("over-time");

    private final String pathSegment;

    LgoBudgetAllocationChartType(String pathSegment) {
        this.pathSegment = pathSegment;
    }

    public String pathSegment() {
        return pathSegment;
    }

    public static LgoBudgetAllocationChartType fromPath(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Chart type is required.");
        }
        String normalized = value.trim().toLowerCase();
        for (LgoBudgetAllocationChartType type : values()) {
            if (type.pathSegment.equals(normalized)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unsupported LGO budget allocation chart type: " + value);
    }
}
