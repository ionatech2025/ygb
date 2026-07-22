package com.ionatech.nac.ygb.domain.valueobjects;

public record GenderCount(String gender, long count) {
    public GenderCount {
        if (gender == null) {
            throw new IllegalArgumentException("GenderCount gender must not be null.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("GenderCount count must not be negative.");
        }
    }
}
