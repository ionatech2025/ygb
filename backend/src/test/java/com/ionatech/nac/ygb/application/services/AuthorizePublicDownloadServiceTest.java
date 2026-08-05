package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DownloadEventRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.DownloadSessionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDownloadSessionException;
import com.ionatech.nac.ygb.domain.model.DownloadEvent;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
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
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthorizePublicDownloadServiceTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-08-04T12:30:00Z"),
            ZoneOffset.UTC
    );
    private static final UUID PROFILE_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final LocalDateTime ISSUED_AT = LocalDateTime.parse("2026-08-04T12:00:00");

    @Mock
    private DownloadSessionRepositoryPort sessionRepository;

    @Mock
    private DownloadEventRepositoryPort eventRepository;

    private AuthorizePublicDownloadService service;

    @BeforeEach
    void setUp() {
        service = new AuthorizePublicDownloadService(sessionRepository, eventRepository, FIXED_CLOCK);
    }

    @Test
    void shouldAuthorizeValidSessionAndRecordCsvDownloadEvent() {
        DownloadSession session = DownloadSession.issue(PROFILE_ID, "valid-token", ISSUED_AT);
        when(sessionRepository.findByToken("valid-token")).thenReturn(Optional.of(session));
        when(eventRepository.save(any(DownloadEvent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DownloadSession authorized = service.authorizeAndRecord(
                "valid-token",
                PublicDownloadDataset.PDM,
                ExportFormat.CSV,
                "districtId=kampala"
        );

        assertThat(authorized.getToken()).isEqualTo("valid-token");

        ArgumentCaptor<DownloadEvent> eventCaptor = ArgumentCaptor.forClass(DownloadEvent.class);
        verify(eventRepository).save(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getDataset()).isEqualTo(PublicDownloadDataset.PDM);
        assertThat(eventCaptor.getValue().getFormat()).isEqualTo(ExportFormat.CSV);
        assertThat(eventCaptor.getValue().getProfileId()).isEqualTo(PROFILE_ID);
        assertThat(eventCaptor.getValue().getSessionId()).isEqualTo(session.getId());
        assertThat(eventCaptor.getValue().getFilterFingerprint()).isEqualTo("districtId=kampala");
    }

    @Test
    void shouldRecordXlsxDownloadEvent() {
        DownloadSession session = DownloadSession.issue(PROFILE_ID, "valid-token", ISSUED_AT);
        when(sessionRepository.findByToken("valid-token")).thenReturn(Optional.of(session));
        when(eventRepository.save(any(DownloadEvent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.authorizeAndRecord("valid-token", PublicDownloadDataset.BUDGET_PRIORITIES, ExportFormat.XLSX, null);

        ArgumentCaptor<DownloadEvent> eventCaptor = ArgumentCaptor.forClass(DownloadEvent.class);
        verify(eventRepository).save(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getDataset()).isEqualTo(PublicDownloadDataset.BUDGET_PRIORITIES);
        assertThat(eventCaptor.getValue().getFormat()).isEqualTo(ExportFormat.XLSX);
    }

    @Test
    void shouldRejectMissingToken() {
        assertThatThrownBy(() -> service.authorizeAndRecord(
                null, PublicDownloadDataset.PDM, ExportFormat.CSV, null
        )).isInstanceOf(InvalidDownloadSessionException.class)
                .hasMessageContaining("required");

        verify(eventRepository, never()).save(any());
    }

    @Test
    void shouldRejectUnknownToken() {
        when(sessionRepository.findByToken("nope")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.authorizeAndRecord(
                "nope", PublicDownloadDataset.PDM, ExportFormat.CSV, null
        )).isInstanceOf(InvalidDownloadSessionException.class)
                .hasMessageContaining("Unknown");

        verify(eventRepository, never()).save(any());
    }

    @Test
    void shouldRejectExpiredSession() {
        DownloadSession expired = DownloadSession.issue(PROFILE_ID, "old-token", ISSUED_AT.minusHours(2));
        when(sessionRepository.findByToken("old-token")).thenReturn(Optional.of(expired));

        assertThatThrownBy(() -> service.authorizeAndRecord(
                "old-token", PublicDownloadDataset.LGO_BUDGET_ALLOCATION, ExportFormat.CSV, null
        )).isInstanceOf(InvalidDownloadSessionException.class)
                .hasMessageContaining("expired");

        verify(eventRepository, never()).save(any());
    }
}
