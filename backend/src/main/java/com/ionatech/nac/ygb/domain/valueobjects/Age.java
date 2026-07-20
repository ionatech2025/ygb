package com.ionatech.nac.ygb.domain.valueobjects;

public class Age {
    private final int value;

    public Age(int value) {
        if (value < 15) {
            throw new IllegalArgumentException("Age must be at least 15");
        }
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
