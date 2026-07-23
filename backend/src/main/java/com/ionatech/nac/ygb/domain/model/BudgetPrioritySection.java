package com.ionatech.nac.ygb.domain.model;

public enum BudgetPrioritySection {
    HEALTH,
    AGRICULTURE,
    EDUCATION,
    CLIMATE;

    public static BudgetPrioritySection fromApiSegment(String segment) {
        if (segment == null || segment.isBlank()) {
            throw new IllegalArgumentException("Budget priority section cannot be null or blank");
        }
        return switch (segment.trim().toLowerCase()) {
            case "health" -> HEALTH;
            case "agriculture" -> AGRICULTURE;
            case "education" -> EDUCATION;
            case "climate" -> CLIMATE;
            default -> throw new IllegalArgumentException("Unknown budget priority section: " + segment);
        };
    }

    public String toApiSegment() {
        return name().toLowerCase();
    }
}
