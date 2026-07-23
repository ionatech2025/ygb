package com.ionatech.nac.ygb.domain.valueobjects;

public enum BudgetPriorityChartType {
    BY_PRIORITY_AREA("by-priority-area"),
    BY_SECTOR("by-sector"),
    OVER_TIME("over-time");

    private final String pathSegment;

    BudgetPriorityChartType(String pathSegment) {
        this.pathSegment = pathSegment;
    }

    public String pathSegment() {
        return pathSegment;
    }

    public static BudgetPriorityChartType fromPath(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Chart type is required.");
        }
        String normalized = value.trim().toLowerCase();
        for (BudgetPriorityChartType type : values()) {
            if (type.pathSegment.equals(normalized)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unsupported budget priority chart type: " + value);
    }
}
