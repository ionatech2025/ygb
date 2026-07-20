package com.ionatech.nac.ygb.domain.valueobjects;

public class NarrativeText {
    private final String value;

    public NarrativeText(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or blank");
        }
        if (value.trim().length() < 10) {
            throw new IllegalArgumentException("Text must be at least 10 characters");
        }
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
