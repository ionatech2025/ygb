package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.Objects;
import java.util.regex.Pattern;

public final class PhoneNumber {
    private static final Pattern LOCAL_UGANDA_PATTERN = Pattern.compile("^(077|078|076|070|075)\\d{7}$");

    private final String value;

    private PhoneNumber(String value) {
        this.value = value;
    }

    public static PhoneNumber of(String raw) {
        String normalized = normalize(raw);
        if (!isValidLocal(normalized)) {
            throw new IllegalArgumentException("Invalid Uganda phone number: " + raw);
        }
        return new PhoneNumber(normalized);
    }

    public String getValue() {
        return value;
    }

    static String normalize(String input) {
        if (input == null) {
            return "";
        }
        String raw = input.trim().replaceAll("[^+\\d]", "");
        String digits = raw.startsWith("+") ? raw.substring(1) : raw;

        if (digits.matches("0\\d{9}")) {
            return digits;
        }
        if (digits.matches("256\\d{9}")) {
            return "0" + digits.substring(3);
        }
        if (digits.matches("7\\d{8}")) {
            return "0" + digits;
        }
        return input.trim();
    }

    static boolean isValidLocal(String normalized) {
        return LOCAL_UGANDA_PATTERN.matcher(normalized).matches();
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof PhoneNumber that)) {
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
