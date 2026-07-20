package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

/**
 * Read-only value object representing one node in the Uganda administrative hierarchy.
 * The hierarchy is: DISTRICT → SUBCOUNTY → PARISH → VILLAGE.
 */
public record AdminLocation(
        UUID id,
        String name,
        UUID parentId,   // null for top-level DISTRICT nodes
        AdminLocationLevel level
) {
    public AdminLocation {
        if (id == null)    throw new IllegalArgumentException("AdminLocation id must not be null.");
        if (name == null)  throw new IllegalArgumentException("AdminLocation name must not be null.");
        if (level == null) throw new IllegalArgumentException("AdminLocation level must not be null.");
    }
}
