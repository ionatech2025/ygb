package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.User;

import java.util.List;

public record UserPage(
        List<User> items,
        long totalElements,
        int page,
        int size
) {
    public UserPage {
        items = List.copyOf(items);
        if (page < 0 || size < 1) {
            throw new IllegalArgumentException("UserPage page and size must be valid.");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("UserPage totalElements must not be negative.");
        }
    }

    public int totalPages() {
        return (int) Math.ceil((double) totalElements / size);
    }
}
