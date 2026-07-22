package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

public record FilterCollectorOption(UUID id, String name) {
    public FilterCollectorOption {
        if (id == null) {
            throw new IllegalArgumentException("FilterCollectorOption id must not be null.");
        }
        if (name == null) {
            throw new IllegalArgumentException("FilterCollectorOption name must not be null.");
        }
    }
}
