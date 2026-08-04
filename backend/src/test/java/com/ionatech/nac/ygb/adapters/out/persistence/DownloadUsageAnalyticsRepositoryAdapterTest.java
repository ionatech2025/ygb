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
import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.PublicVisitEventRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadEvent;
import com.ionatech.nac.ygb.domain.model.DownloadProfile;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.EmailAddress;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
import com.ionatech.nac.ygb.domain.valueobjects.IsoCountryCode;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({DownloadUsageAnalyticsJpaRepository.class, DownloadUsageAnalyticsRepositoryAdapter.class})
class DownloadUsageAnalyticsRepositoryAdapterTest {

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

    @Autowired
    private DownloadUsageAnalyticsRepositoryPort analyticsRepository;

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
    void shouldFilterDownloadersByGenderAndAgeGroup() {
        LocalDateTime now = LocalDateTime.parse("2026-08-04T12:00:00");
        DownloadProfile femaleYoung = saveProfile("f@example.com", Gender.FEMALE, AgeGroup.AGE_18_24, now);
        DownloadProfile maleOlder = saveProfile("m@example.com", Gender.MALE, AgeGroup.AGE_30_35, now);
        DownloadSession femaleSession = sessionRepository.save(DownloadSession.issue(femaleYoung.getId(), "tok-f", now));
        DownloadSession maleSession = sessionRepository.save(DownloadSession.issue(maleOlder.getId(), "tok-m", now));
        eventRepository.save(DownloadEvent.recordNew(
                femaleYoung.getId(), femaleSession.getId(), PublicDownloadDataset.PDM, ExportFormat.CSV, now, null
        ));
        eventRepository.save(DownloadEvent.recordNew(
                maleOlder.getId(), maleSession.getId(), PublicDownloadDataset.BUDGET_PRIORITIES, ExportFormat.XLSX, now, null
        ));

        DownloaderPage page = analyticsRepository.findDownloaders(
                DownloadUsageFilter.of("FEMALE", "AGE_18_24"),
                PageRequest.of(0, 25)
        );

        assertThat(page.totalElements()).isEqualTo(1);
        assertThat(page.items().getFirst().email()).isEqualTo("f@example.com");
        assertThat(page.items().getFirst().downloadCount()).isEqualTo(1);
    }

    @Test
    void shouldAggregateDownloadUsageAndVisitsVsDownloads() {
        LocalDateTime now = LocalDateTime.parse("2026-08-04T12:00:00");
        DownloadProfile profile = saveProfile("a@example.com", Gender.FEMALE, AgeGroup.AGE_18_24, now);
        DownloadSession session = sessionRepository.save(DownloadSession.issue(profile.getId(), "tok-a", now));
        eventRepository.save(DownloadEvent.recordNew(
                profile.getId(), session.getId(), PublicDownloadDataset.PDM, ExportFormat.CSV, now, null
        ));
        visitRepository.save(PublicVisitEvent.recordNew("anon-1", "public-dashboard", now));
        visitRepository.save(PublicVisitEvent.recordNew("anon-2", "public-dashboard", now));

        DownloadUsageAggregates aggregates = analyticsRepository.getDownloadUsageAggregates(
                DownloadUsageFilter.empty(),
                TimeSeriesGranularity.DAY
        );
        assertThat(aggregates.totalDownloaders()).isEqualTo(1);
        assertThat(aggregates.totalDownloads()).isEqualTo(1);
        assertThat(aggregates.byDataset()).extracting(d -> d.dataset()).contains("PDM");

        VisitsVsDownloadsComparison comparison = analyticsRepository.getVisitsVsDownloads(
                DownloadUsageFilter.empty(),
                TimeSeriesGranularity.DAY
        );
        assertThat(comparison.totalUniqueVisitors()).isEqualTo(2);
        assertThat(comparison.totalUniqueDownloaders()).isEqualTo(1);
        assertThat(comparison.overTime()).isNotEmpty();
        assertThat(comparison.overTime().getFirst().bucketStart()).isEqualTo(LocalDate.of(2026, 8, 4));
    }

    @Test
    void shouldAggregatePublicDownloadUsageWithoutJoiningProfiles() {
        LocalDateTime now = LocalDateTime.parse("2026-08-04T12:00:00");
        DownloadProfile profile = saveProfile("public@example.com", Gender.FEMALE, AgeGroup.AGE_18_24, now);
        DownloadSession session = sessionRepository.save(DownloadSession.issue(profile.getId(), "tok-public", now));
        eventRepository.save(DownloadEvent.recordNew(
                profile.getId(), session.getId(), PublicDownloadDataset.PDM, ExportFormat.CSV, now, null
        ));
        eventRepository.save(DownloadEvent.recordNew(
                profile.getId(), session.getId(), PublicDownloadDataset.BUDGET_PRIORITIES, ExportFormat.XLSX, now, null
        ));
        eventRepository.save(DownloadEvent.recordNew(
                profile.getId(), session.getId(), PublicDownloadDataset.LGO_BUDGET_ALLOCATION, ExportFormat.CSV, now, null
        ));

        PublicDownloadUsageAggregates publicAggregates = analyticsRepository.getPublicDownloadUsageAggregates(
                null,
                null,
                TimeSeriesGranularity.DAY
        );

        assertThat(publicAggregates.totalDownloads()).isEqualTo(3);
        assertThat(publicAggregates.byDataset()).extracting(d -> d.dataset())
                .contains("PDM", "BUDGET_PRIORITIES", "LGO_BUDGET_ALLOCATION");
        assertThat(publicAggregates.downloadsOverTime()).isNotEmpty();
    }

    private DownloadProfile saveProfile(String email, Gender gender, AgeGroup ageGroup, LocalDateTime createdAt) {
        return profileRepository.save(DownloadProfile.recordNew(
                EmailAddress.of(email),
                null,
                IsoCountryCode.of("UG"),
                gender,
                ageGroup,
                FieldOfOperation.ACADEMIA_RESEARCH,
                null,
                true,
                createdAt
        ));
    }
}
