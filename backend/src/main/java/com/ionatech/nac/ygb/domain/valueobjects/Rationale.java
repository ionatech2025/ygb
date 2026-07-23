package com.ionatech.nac.ygb.domain.valueobjects;

public final class Rationale {

    private final NarrativeText narrative;

    public Rationale(String value) {
        this.narrative = new NarrativeText(value);
    }

    public String getValue() {
        return narrative.getValue();
    }
}
