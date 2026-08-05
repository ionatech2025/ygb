package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.RecordPublicVisitUseCase;
import com.ionatech.nac.ygb.application.ports.spi.PublicVisitEventRepositoryPort;
import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;

public class RecordPublicVisitService implements RecordPublicVisitUseCase {

    /** Same anonymous session + route within this window is treated as one visit. */
    public static final Duration DEDUPE_WINDOW = Duration.ofHours(1);

    private final PublicVisitEventRepositoryPort visitRepository;
    private final Clock clock;

    public RecordPublicVisitService(PublicVisitEventRepositoryPort visitRepository, Clock clock) {
        this.visitRepository = visitRepository;
        this.clock = clock;
    }

    @Override
    public boolean record(String anonymousSessionId, String routeGroup) {
        LocalDateTime now = LocalDateTime.ofInstant(clock.instant(), clock.getZone());
        PublicVisitEvent candidate = PublicVisitEvent.recordNew(anonymousSessionId, routeGroup, now);

        LocalDateTime since = now.minus(DEDUPE_WINDOW);
        if (visitRepository.existsByAnonymousSessionIdAndRouteGroupSince(
                candidate.getAnonymousSessionId(),
                candidate.getRouteGroup(),
                since
        )) {
            return false;
        }

        visitRepository.save(candidate);
        return true;
    }
}
