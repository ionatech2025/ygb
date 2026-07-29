package com.ionatech.nac.ygb.domain.valueobjects;

public enum AgeGroup {
    AGE_BELOW_18("Below 18"),
    AGE_18_24("18-24"),
    AGE_25_29("25-29"),
    AGE_30_35("30-35"),
    AGE_ABOVE_35("Above 35");

    private final String label;

    AgeGroup(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public boolean isOutOfProgrammeScope() {
        return this == AGE_BELOW_18;
    }
}
