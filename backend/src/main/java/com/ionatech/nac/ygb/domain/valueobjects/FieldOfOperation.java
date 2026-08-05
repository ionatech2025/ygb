package com.ionatech.nac.ygb.domain.valueobjects;

public enum FieldOfOperation {
    ACADEMIA_RESEARCH("Academia/Research"),
    GOVERNMENT("Government"),
    NGO_CSO("NGO/CSO"),
    DONOR_DEVELOPMENT_PARTNER("Donor/Development partner"),
    MEDIA("Media"),
    PRIVATE_SECTOR("Private sector"),
    STUDENT("Student"),
    OTHER("Other");

    private final String label;

    FieldOfOperation(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public boolean requiresSpecify() {
        return this == OTHER;
    }
}
