package com.ionatech.nac.ygb.domain.valueobjects;

public enum AgeGroup {
    AGE_15_19("15-19"),
    AGE_20_24("20-24"),
    AGE_25_29("25-29"),
    AGE_30_AND_ABOVE("30+");

    private final String label;

    AgeGroup(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
