package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.UUID;

public record Location(UUID districtId, UUID subcountyId, UUID parishId, UUID villageId) {
    public Location {
        if (districtId == null) {
            throw new IllegalArgumentException("District ID cannot be null");
        }
        if (subcountyId == null) {
            throw new IllegalArgumentException("Sub-county ID cannot be null");
        }
        if (parishId == null) {
            throw new IllegalArgumentException("Parish ID cannot be null");
        }
        if (villageId == null) {
            throw new IllegalArgumentException("Village ID cannot be null");
        }
    }
}
