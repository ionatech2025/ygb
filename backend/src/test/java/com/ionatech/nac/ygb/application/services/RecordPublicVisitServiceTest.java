package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.PublicVisitEventRepositoryPort;
import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecordPublicVisitServiceTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-08-04T14:00:00Z"),
            ZoneOffset.UTC
    );
    private static final LocalDateTime NOW = LocalDateTime.parse("2026-08-04T14:00:00");
    private static final LocalDateTime DEDUPE_SINCE = LocalDateTime.parse("2026-08-04T13:00:00");

    @Mock
    private PublicVisitEventRepositoryPort visitRepository;

    private RecordPublicVisitService service;

    @BeforeEach
    void setUp() {
        service = new RecordPublicVisitService(visitRepository, FIXED_CLOCK);
    }

    @Test
    void shouldPersistVisitWhenNoRecentBeaconForSessionAndRoute() {
        when(visitRepository.existsByAnonymousSessionIdAndRouteGroupSince(
                "anon-1", "public-dashboard", DEDUPE_SINCE
        )).thenReturn(false);
        when(visitRepository.save(any(PublicVisitEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        boolean recorded = service.record("anon-1", "public-dashboard");

        assertThat(recorded).isTrue();
        ArgumentCaptor<PublicVisitEvent> captor = ArgumentCaptor.forClass(PublicVisitEvent.class);
        verify(visitRepository).save(captor.capture());
        assertThat(captor.getValue().getAnonymousSessionId()).isEqualTo("anon-1");
        assertThat(captor.getValue().getRouteGroup()).isEqualTo("public-dashboard");
        assertThat(captor.getValue().getVisitedAt()).isEqualTo(NOW);
    }

    @Test
    void shouldNotPersistDuplicateWithinOneHourDedupeWindow() {
        // Rule: same anonymousSessionId + routeGroup within 1 hour is a no-op (server-side bucket).
        when(visitRepository.existsByAnonymousSessionIdAndRouteGroupSince(
                eq("anon-1"), eq("public-dashboard"), eq(DEDUPE_SINCE)
        )).thenReturn(true);

        boolean recorded = service.record("anon-1", "public-dashboard");

        assertThat(recorded).isFalse();
        verify(visitRepository, never()).save(any());
    }

    @Test
    void shouldAllowSameSessionOnDifferentRouteGroup() {
        when(visitRepository.existsByAnonymousSessionIdAndRouteGroupSince(
                "anon-1", "budget-priorities", DEDUPE_SINCE
        )).thenReturn(false);
        when(visitRepository.save(any(PublicVisitEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(service.record("anon-1", "budget-priorities")).isTrue();
        verify(visitRepository).save(any(PublicVisitEvent.class));
    }

    @Test
    void shouldRejectBlankAnonymousSessionId() {
        assertThatThrownBy(() -> service.record("  ", "public-dashboard"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Anonymous session");

        verify(visitRepository, never()).save(any());
    }

    @Test
    void shouldRejectBlankRouteGroup() {
        assertThatThrownBy(() -> service.record("anon-1", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Route group");

        verify(visitRepository, never()).save(any());
    }
}
