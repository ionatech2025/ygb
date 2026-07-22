package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.CollectorTrackerRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.IypSubmission;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({CollectorTrackerJpaRepository.class, CollectorTrackerRepositoryAdapter.class})
class CollectorTrackerRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CollectorTrackerRepositoryPort collectorTrackerRepository;

    private SubmissionRepositoryPort submissionRepository;

    private final UUID primaryCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final UUID secondaryCollectorId = UUID.fromString("33333333-3333-3333-3333-333333333333");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(submissionJpaRepository, submissionMapper, null, null);
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);
        seedSecondaryCollector();
        saveSampleSubmissions();
    }

    @Test
    void shouldReturnLeaderboardSortedByCountDescendingThenNameAscending() {
        List<CollectorLeaderboardEntry> leaderboard = collectorTrackerRepository.findLeaderboard(DashboardFilter.empty());

        assertThat(leaderboard).hasSize(2);
        assertThat(leaderboard.get(0).collectorId()).isEqualTo(primaryCollectorId);
        assertThat(leaderboard.get(0).fullName()).isEqualTo("Default Collector");
        assertThat(leaderboard.get(0).totalCount()).isEqualTo(3L);
        assertThat(leaderboard.get(1).collectorId()).isEqualTo(secondaryCollectorId);
        assertThat(leaderboard.get(1).fullName()).isEqualTo("Second Collector");
        assertThat(leaderboard.get(1).totalCount()).isEqualTo(1L);
    }

    @Test
    void shouldRecalculateCountsWhenFinancialYearPeriodFilterApplied() {
        submissionRepository.save(createByp(
                "July Respondent",
                "FEMALE",
                ntungamoLocation(),
                UUID.randomUUID(),
                primaryCollectorId,
                LocalDateTime.of(2026, 8, 1, 9, 0)
        ));

        DashboardFilter janJunFilter = new DashboardFilter(
                null, null, null, null, null, null, null, null, null, "JAN_JUN_2026"
        );

        List<CollectorLeaderboardEntry> filtered = collectorTrackerRepository.findLeaderboard(janJunFilter);
        CollectorLeaderboardEntry primaryEntry = filtered.stream()
                .filter(entry -> entry.collectorId().equals(primaryCollectorId))
                .findFirst()
                .orElseThrow();

        assertThat(primaryEntry.totalCount()).isEqualTo(3L);
        assertThat(collectorTrackerRepository.findLeaderboard(DashboardFilter.empty()).stream()
                .filter(entry -> entry.collectorId().equals(primaryCollectorId))
                .findFirst()
                .orElseThrow()
                .totalCount()).isEqualTo(4L);
    }

    private void seedSecondaryCollector() {
        jdbcTemplate.update(
                """
                INSERT INTO users (id, name, phone_number, password_hash, role, is_active, created_at)
                VALUES (?, 'Second Collector', '0772222222',
                '$2a$10$KHK5f8Lz/uT8/0S91J9LRe4hF/t08qH7wR/70P71k0T8y.4XJ7.sC', 'DATA_COLLECTOR', true, CURRENT_TIMESTAMP)
                """,
                secondaryCollectorId
        );
    }

    private void saveSampleSubmissions() {
        submissionRepository.save(createByp("Jane One", "FEMALE", ntungamoLocation(), UUID.randomUUID(), primaryCollectorId));
        submissionRepository.save(createByp("Jane Two", "FEMALE", ntungamoLocation(), UUID.randomUUID(), primaryCollectorId));
        submissionRepository.save(createByp("John Three", "MALE", ntungamoLocation(), UUID.randomUUID(), primaryCollectorId));
        submissionRepository.save(createIyp("John Four", "MALE", kampalaLocation(), UUID.randomUUID(), secondaryCollectorId));
    }

    private Location ntungamoLocation() {
        return TestLocationFixtures.ntungamoLocation();
    }

    private Location kampalaLocation() {
        return TestLocationFixtures.kampalaLocation();
    }

    private SubmissionMetadata metadata(UUID deviceSubmissionId, UUID collectorId) {
        return metadata(deviceSubmissionId, collectorId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private SubmissionMetadata metadata(UUID deviceSubmissionId, UUID collectorId, LocalDateTime completedAt) {
        return new SubmissionMetadata(collectorId, deviceSubmissionId, completedAt);
    }

    private BypSubmission createByp(
            String name,
            String gender,
            Location location,
            UUID deviceSubmissionId,
            UUID collectorId
    ) {
        return createByp(name, gender, location, deviceSubmissionId, collectorId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private BypSubmission createByp(
            String name,
            String gender,
            Location location,
            UUID deviceSubmissionId,
            UUID collectorId,
            LocalDateTime completedAt
    ) {
        return new BypSubmission(
                UUID.randomUUID(),
                metadata(deviceSubmissionId, collectorId, completedAt),
                location,
                name,
                "0772000" + deviceSubmissionId.toString().substring(0, 3),
                gender,
                AgeGroup.AGE_20_24,
                new Age(22),
                "ONE_WEEK",
                null,
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                new NarrativeText("Provide more technical support.")
        );
    }

    private IypSubmission createIyp(
            String name,
            String gender,
            Location location,
            UUID deviceSubmissionId,
            UUID collectorId
    ) {
        return new IypSubmission(
                UUID.randomUUID(),
                metadata(deviceSubmissionId, collectorId),
                location,
                name,
                "0773000" + deviceSubmissionId.toString().substring(0, 3),
                gender,
                AgeGroup.AGE_15_19,
                true,
                true,
                true,
                false,
                new NarrativeText("Application rejected without clear feedback."),
                List.of("LACK_OF_COLLATERAL"),
                List.of("RADIO"),
                List.of("LIMITATION_IN_AMOUNT"),
                new NarrativeText("Explain limitation text here."),
                new NarrativeText("Improve awareness campaigns.")
        );
    }
}
