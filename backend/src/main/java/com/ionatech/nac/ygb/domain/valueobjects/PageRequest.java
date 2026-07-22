package com.ionatech.nac.ygb.domain.valueobjects;

public record PageRequest(int page, int size) {
    private static final int DEFAULT_SIZE = 25;
    private static final int MAX_SIZE = 100;

    public PageRequest {
        if (page < 0) {
            throw new IllegalArgumentException("Page index must not be negative.");
        }
        if (size < 1 || size > MAX_SIZE) {
            throw new IllegalArgumentException("Page size must be between 1 and " + MAX_SIZE + ".");
        }
    }

    public static PageRequest of(int page, int size) {
        int normalizedPage = Math.max(page, 0);
        int normalizedSize = size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        return new PageRequest(normalizedPage, normalizedSize);
    }

    public int offset() {
        return page * size;
    }
}
