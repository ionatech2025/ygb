package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;

import java.time.LocalDateTime;

public interface PublicVisitEventRepositoryPort {
    PublicVisitEvent save(PublicVisitEvent event);

    boolean existsByAnonymousSessionIdAndRouteGroupSince(
            String anonymousSessionId,
            String routeGroup,
            LocalDateTime since
    );
}
