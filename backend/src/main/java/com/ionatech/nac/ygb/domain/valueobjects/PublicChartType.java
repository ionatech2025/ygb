package com.ionatech.nac.ygb.domain.valueobjects;

public enum PublicChartType {
    BY_DISTRICT("by-district"),
    BY_GENDER("by-gender"),
    BY_AGE_GROUP("by-age-group"),
    TREND("trend");

    private final String pathSegment;

    PublicChartType(String pathSegment) {
        this.pathSegment = pathSegment;
    }

    public String pathSegment() {
        return pathSegment;
    }

    public static PublicChartType fromPath(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Chart type is required.");
        }
        String normalized = value.trim().toLowerCase();
        for (PublicChartType type : values()) {
            if (type.pathSegment.equals(normalized)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unsupported chart type: " + value);
    }
}
