package com.ionatech.nac.ygb.domain.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class DownloadSessionTest {

    private static final LocalDateTime ISSUED_AT = LocalDateTime.parse("2026-08-04T12:00:00");
    private static final UUID PROFILE_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @Test
    void shouldBeUsableBeforeExpiry() {
        DownloadSession session = DownloadSession.issue(PROFILE_ID, "opaque-token", ISSUED_AT);

        assertThat(session.isUsableAt(ISSUED_AT.plusMinutes(59))).isTrue();
        assertThat(session.getExpiresAt()).isEqualTo(ISSUED_AT.plusHours(1));
        assertThat(session.getToken()).isEqualTo("opaque-token");
        assertThat(session.getProfileId()).isEqualTo(PROFILE_ID);
    }

    @Test
    void shouldNotBeUsableAtOrAfterExpiry() {
        DownloadSession session = DownloadSession.issue(PROFILE_ID, "opaque-token", ISSUED_AT);

        assertThat(session.isUsableAt(ISSUED_AT.plusHours(1))).isFalse();
        assertThat(session.isUsableAt(ISSUED_AT.plusHours(1).plusSeconds(1))).isFalse();
    }
}
