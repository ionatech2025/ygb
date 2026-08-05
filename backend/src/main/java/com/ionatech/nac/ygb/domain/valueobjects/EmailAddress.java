package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.Objects;
import java.util.regex.Pattern;

public final class EmailAddress {
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private final String value;

    private EmailAddress(String value) {
        this.value = value;
    }

    public static EmailAddress of(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("Invalid email address: " + raw);
        }
        String normalized = raw.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid email address: " + raw);
        }
        return new EmailAddress(normalized);
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof EmailAddress that)) {
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
