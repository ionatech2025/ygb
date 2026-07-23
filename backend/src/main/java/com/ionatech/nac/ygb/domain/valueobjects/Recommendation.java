package com.ionatech.nac.ygb.domain.valueobjects;

public final class Recommendation {

    private final NarrativeText narrative;

    public Recommendation(String value) {
        this.narrative = new NarrativeText(value);
    }

    public String getValue() {
        return narrative.getValue();
    }
}
