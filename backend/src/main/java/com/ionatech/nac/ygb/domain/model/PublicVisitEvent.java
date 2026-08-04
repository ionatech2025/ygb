package com.ionatech.nac.ygb.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class PublicVisitEvent {
    private final UUID id;
    private final String anonymousSessionId;
    private final String routeGroup;
    private final LocalDateTime visitedAt;

    private PublicVisitEvent(
            UUID id,
            String anonymousSessionId,
            String routeGroup,
            LocalDateTime visitedAt
    ) {
        this.id = id;
        this.anonymousSessionId = anonymousSessionId;
        this.routeGroup = routeGroup;
        this.visitedAt = visitedAt;
    }

    public static PublicVisitEvent recordNew(
            String anonymousSessionId,
            String routeGroup,
            LocalDateTime visitedAt
    ) {
        Objects.requireNonNull(visitedAt, "Visited timestamp cannot be null");
        if (anonymousSessionId == null || anonymousSessionId.isBlank()) {
            throw new IllegalArgumentException("Anonymous session id cannot be blank");
        }
        if (routeGroup == null || routeGroup.isBlank()) {
            throw new IllegalArgumentException("Route group cannot be blank");
        }
        return new PublicVisitEvent(
                UUID.randomUUID(),
                anonymousSessionId.trim(),
                routeGroup.trim(),
                visitedAt
        );
    }

    public static PublicVisitEvent rehydrate(
            UUID id,
            String anonymousSessionId,
            String routeGroup,
            LocalDateTime visitedAt
    ) {
        return new PublicVisitEvent(id, anonymousSessionId, routeGroup, visitedAt);
    }

    public UUID getId() {
        return id;
    }

    public String getAnonymousSessionId() {
        return anonymousSessionId;
    }

    public String getRouteGroup() {
        return routeGroup;
    }

    public LocalDateTime getVisitedAt() {
        return visitedAt;
    }
}
