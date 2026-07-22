package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.LocationHierarchyPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.util.UUID;

/**
 * Validates cascading location IDs on a dashboard filter before querying aggregates.
 */
public class DashboardFilterHierarchyValidator {

    private final LocationHierarchyPort locationHierarchyPort;

    public DashboardFilterHierarchyValidator(LocationHierarchyPort locationHierarchyPort) {
        this.locationHierarchyPort = locationHierarchyPort;
    }

    public void validate(DashboardFilter filter) {
        if (filter == null) {
            return;
        }
        if (filter.parishId() != null && filter.subcountyId() != null) {
            requireParent(filter.parishId(), filter.subcountyId(), "Parish does not belong to the selected sub-county.");
        }
        if (filter.subcountyId() != null && filter.districtId() != null) {
            requireParent(filter.subcountyId(), filter.districtId(), "Sub-county does not belong to the selected district.");
        }
        if (filter.parishId() != null && filter.districtId() != null && filter.subcountyId() == null) {
            UUID subcountyId = locationHierarchyPort.findParentId(filter.parishId())
                    .orElseThrow(() -> new InvalidDashboardFilterException("Parish location not found."));
            UUID districtId = locationHierarchyPort.findParentId(subcountyId)
                    .orElseThrow(() -> new InvalidDashboardFilterException("Sub-county location not found."));
            if (!filter.districtId().equals(districtId)) {
                throw new InvalidDashboardFilterException("Parish does not belong to the selected district.");
            }
        }
    }

    private void requireParent(UUID childId, UUID expectedParentId, String message) {
        UUID actualParentId = locationHierarchyPort.findParentId(childId)
                .orElseThrow(() -> new InvalidDashboardFilterException("Location not found."));
        if (!expectedParentId.equals(actualParentId)) {
            throw new InvalidDashboardFilterException(message);
        }
    }
}
