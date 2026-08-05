package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.DownloadEventMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.DownloadProfileMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.DownloadSessionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.PublicVisitEventMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.DownloadEventJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.DownloadProfileJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.DownloadSessionJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.PublicVisitEventJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DownloadEventRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.DownloadProfileRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.DownloadSessionRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.PublicVisitEventRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadEvent;
import com.ionatech.nac.ygb.domain.model.DownloadProfile;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.EmailAddress;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
import com.ionatech.nac.ygb.domain.valueobjects.IsoCountryCode;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class DownloadProfileUsageRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private DownloadProfileJpaRepository profileJpaRepository;

    @Autowired
    private DownloadSessionJpaRepository sessionJpaRepository;

    @Autowired
    private DownloadEventJpaRepository eventJpaRepository;

    @Autowired
    private PublicVisitEventJpaRepository visitJpaRepository;

    private DownloadProfileRepositoryPort profileRepository;
    private DownloadSessionRepositoryPort sessionRepository;
    private DownloadEventRepositoryPort eventRepository;
    private PublicVisitEventRepositoryPort visitRepository;

    @BeforeEach
    void setUp() {
        profileRepository = new DownloadProfileRepositoryAdapter(
                profileJpaRepository,
                Mappers.getMapper(DownloadProfileMapper.class)
        );
        sessionRepository = new DownloadSessionRepositoryAdapter(
                sessionJpaRepository,
                Mappers.getMapper(DownloadSessionMapper.class)
        );
        eventRepository = new DownloadEventRepositoryAdapter(
                eventJpaRepository,
                Mappers.getMapper(DownloadEventMapper.class)
        );
        visitRepository = new PublicVisitEventRepositoryAdapter(
                visitJpaRepository,
                Mappers.getMapper(PublicVisitEventMapper.class)
        );
    }

    @Test
    void shouldRoundTripProfileSessionAndDownloadEvent() {
        LocalDateTime now = LocalDateTime.parse("2026-08-04T15:00:00");

        DownloadProfile profile = profileRepository.save(DownloadProfile.recordNew(
                EmailAddress.of("researcher@example.com"),
                "Grace Hopper",
                IsoCountryCode.of("UG"),
                Gender.FEMALE,
                AgeGroup.AGE_30_35,
                FieldOfOperation.ACADEMIA_RESEARCH,
                null,
                true,
                now
        ));

        DownloadSession session = sessionRepository.save(
                DownloadSession.issue(profile.getId(), "session-token-abc", now)
        );

        DownloadEvent event = eventRepository.save(DownloadEvent.recordNew(
                profile.getId(),
                session.getId(),
                PublicDownloadDataset.PDM,
                ExportFormat.CSV,
                now.plusMinutes(1),
                "districtId=kampala"
        ));

        assertThat(profileRepository.findById(profile.getId())).isPresent().get()
                .satisfies(loaded -> {
                    assertThat(loaded.getEmail().getValue()).isEqualTo("researcher@example.com");
                    assertThat(loaded.getOptionalName()).isEqualTo("Grace Hopper");
                    assertThat(loaded.getCountryCode().getValue()).isEqualTo("UG");
                    assertThat(loaded.getGender()).isEqualTo(Gender.FEMALE);
                    assertThat(loaded.getAgeGroup()).isEqualTo(AgeGroup.AGE_30_35);
                });

        assertThat(sessionRepository.findByToken("session-token-abc")).isPresent().get()
                .satisfies(loaded -> {
                    assertThat(loaded.getProfileId()).isEqualTo(profile.getId());
                    assertThat(loaded.isUsableAt(now.plusMinutes(30))).isTrue();
                });

        assertThat(event.getDataset()).isEqualTo(PublicDownloadDataset.PDM);
        assertThat(event.getFormat()).isEqualTo(ExportFormat.CSV);
        assertThat(eventJpaRepository.findById(event.getId())).isPresent();
    }

    @Test
    void shouldPersistPublicVisitEvent() {
        PublicVisitEvent visit = visitRepository.save(PublicVisitEvent.recordNew(
                "anon-session-1",
                "public-dashboard",
                LocalDateTime.parse("2026-08-04T16:00:00")
        ));

        assertThat(visitJpaRepository.findById(visit.getId())).isPresent().get()
                .satisfies(entity -> {
                    assertThat(entity.getAnonymousSessionId()).isEqualTo("anon-session-1");
                    assertThat(entity.getRouteGroup()).isEqualTo("public-dashboard");
                });
    }
}
