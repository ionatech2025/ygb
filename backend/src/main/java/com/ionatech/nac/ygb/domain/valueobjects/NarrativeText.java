package com.ionatech.nac.ygb.domain.valueobjects;

public class NarrativeText {
    public static final int DEFAULT_MIN_LENGTH = 10;
    /** Short duration answers such as "2 days" or "10 months". */
    public static final int DURATION_MIN_LENGTH = 5;

    private final String value;

    public NarrativeText(String value) {
        this(value, DEFAULT_MIN_LENGTH);
    }

    public NarrativeText(String value, int minLength) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or blank");
        }
        if (value.trim().length() < minLength) {
            throw new IllegalArgumentException("Text must be at least " + minLength + " characters");
        }
        this.value = value;
    }

    public static NarrativeText duration(String value) {
        return new NarrativeText(value, DURATION_MIN_LENGTH);
    }

    public String getValue() {
        return value;
    }
}
