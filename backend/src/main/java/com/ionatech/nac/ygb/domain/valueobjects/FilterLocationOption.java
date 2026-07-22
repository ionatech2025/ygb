package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

public record FilterLocationOption(UUID id, String name) {
    public FilterLocationOption {
        if (id == null) {
            throw new IllegalArgumentException("FilterLocationOption id must not be null.");
        }
        if (name == null) {
            throw new IllegalArgumentException("FilterLocationOption name must not be null.");
        }
    }
}
