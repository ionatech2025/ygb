package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileCommand;
import com.ionatech.nac.ygb.application.ports.api.RegisteredDownloadSessionView;
import com.ionatech.nac.ygb.application.ports.spi.DownloadProfileRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.DownloadSessionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadProfile;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegisterDownloadProfileServiceTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-08-04T12:00:00Z"),
            ZoneOffset.UTC
    );

    @Mock
    private DownloadProfileRepositoryPort profileRepository;

    @Mock
    private DownloadSessionRepositoryPort sessionRepository;

    private RegisterDownloadProfileService service;

    @BeforeEach
    void setUp() {
        service = new RegisterDownloadProfileService(profileRepository, sessionRepository, FIXED_CLOCK);
    }

    @Test
    void shouldRegisterProfileAndIssueOpaqueSessionWithFutureExpiry() {
        when(profileRepository.save(any(DownloadProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(sessionRepository.save(any(DownloadSession.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RegisteredDownloadSessionView view = service.register(validCommand());

        assertThat(view.token()).isNotBlank();
        assertThat(view.token()).doesNotContain("@");
        assertThat(view.expiresAt()).isEqualTo(LocalDateTime.of(2026, 8, 4, 13, 0));
        assertThat(view.profileId()).isNotNull();

        ArgumentCaptor<DownloadProfile> profileCaptor = ArgumentCaptor.forClass(DownloadProfile.class);
        verify(profileRepository).save(profileCaptor.capture());
        assertThat(profileCaptor.getValue().getEmail().getValue()).isEqualTo("analyst@example.com");
        assertThat(profileCaptor.getValue().getGender()).isEqualTo(Gender.FEMALE);

        ArgumentCaptor<DownloadSession> sessionCaptor = ArgumentCaptor.forClass(DownloadSession.class);
        verify(sessionRepository).save(sessionCaptor.capture());
        assertThat(sessionCaptor.getValue().getToken()).isEqualTo(view.token());
        assertThat(sessionCaptor.getValue().getProfileId()).isEqualTo(view.profileId());
    }

    @Test
    void shouldRejectMissingConsent() {
        assertThatThrownBy(() -> service.register(commandWithConsent(false)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Consent");

        verify(profileRepository, never()).save(any());
        verify(sessionRepository, never()).save(any());
    }

    @Test
    void shouldRejectInvalidEmail() {
        assertThatThrownBy(() -> service.register(new RegisterDownloadProfileCommand(
                "not-an-email",
                null,
                "UG",
                "FEMALE",
                "AGE_25_29",
                "ACADEMIA_RESEARCH",
                null,
                true
        )))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email");

        verify(profileRepository, never()).save(any());
    }

    @Test
    void shouldRejectOtherWithoutSpecify() {
        assertThatThrownBy(() -> service.register(new RegisterDownloadProfileCommand(
                "analyst@example.com",
                null,
                "UG",
                "MALE",
                "AGE_30_35",
                "OTHER",
                "  ",
                true
        )))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("specify");

        verify(profileRepository, never()).save(any());
    }

    private RegisterDownloadProfileCommand validCommand() {
        return commandWithConsent(true);
    }

    private RegisterDownloadProfileCommand commandWithConsent(boolean consent) {
        return new RegisterDownloadProfileCommand(
                "analyst@example.com",
                "Ada Lovelace",
                "UG",
                Gender.FEMALE.name(),
                AgeGroup.AGE_25_29.name(),
                FieldOfOperation.ACADEMIA_RESEARCH.name(),
                null,
                consent
        );
    }
}
