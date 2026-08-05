package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.Objects;
import java.util.regex.Pattern;

public final class IsoCountryCode {
    private static final Pattern ALPHA_2 = Pattern.compile("^[A-Z]{2}$");

    private final String value;

    private IsoCountryCode(String value) {
        this.value = value;
    }

    public static IsoCountryCode of(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("Invalid ISO country code: " + raw);
        }
        String normalized = raw.trim().toUpperCase();
        if (!ALPHA_2.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid ISO country code: " + raw);
        }
        return new IsoCountryCode(normalized);
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof IsoCountryCode that)) {
            return false;
        }
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
