package com.ionatech.nac.ygb.domain.valueobjects;

public record AgeGroupCount(String ageGroup, long count) {
    public AgeGroupCount {
        if (ageGroup == null || ageGroup.isBlank()) {
            throw new IllegalArgumentException("AgeGroupCount ageGroup must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("AgeGroupCount count must not be negative.");
        }
    }
}
