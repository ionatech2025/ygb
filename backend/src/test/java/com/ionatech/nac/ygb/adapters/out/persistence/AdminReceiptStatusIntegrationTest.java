package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.services.GetAdminReceiptStatusService;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
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
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AdminReceiptStatusQueryJpaRepository.class})
class AdminReceiptStatusIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private AdminReceiptStatusQueryJpaRepository adminReceiptStatusQueryJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private GetAdminReceiptStatusService receiptStatusService;

    private final AtomicInteger phoneSequence = new AtomicInteger(1_000_000);

    private final UUID primaryCollectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final UUID staleCollectorId = UUID.fromString("33333333-3333-3333-3333-333333333333");

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM submissions");
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        SubmissionRepositoryAdapter submissionRepository = new SubmissionRepositoryAdapter(
                submissionJpaRepository,
                submissionMapper,
                null,
                adminReceiptStatusQueryJpaRepository
        );
        receiptStatusService = new GetAdminReceiptStatusService(submissionRepository);
        seedStaleCollector();
        seedSubmissions();
    }

    @Test
    void shouldReturnStatusCountsMatchingSeededDatabaseState() {
        AdminReceiptStatus status = receiptStatusService.getReceiptStatus();

        assertThat(status.totalSynced()).isEqualTo(3L);
        assertThat(status.totalFlagged()).isEqualTo(1L);
        assertThat(status.totalDuplicate()).isEqualTo(1L);

        CollectorReceiptStatus primary = findCollector(status.byCollector(), primaryCollectorId);
        assertThat(primary.syncedCount()).isEqualTo(2L);
        assertThat(primary.flaggedCount()).isEqualTo(1L);
        assertThat(primary.duplicateCount()).isEqualTo(1L);
        assertThat(primary.stale()).isFalse();
    }

    @Test
    void shouldFlagCollectorWithOldLastReceivedAtAsStale() {
        AdminReceiptStatus status = receiptStatusService.getReceiptStatus();

        CollectorReceiptStatus staleCollector = findCollector(status.byCollector(), staleCollectorId);
        assertThat(staleCollector.syncedCount()).isEqualTo(1L);
        assertThat(staleCollector.lastReceivedAt()).isNotNull();
        assertThat(staleCollector.stale()).isTrue();
    }

    private CollectorReceiptStatus findCollector(List<CollectorReceiptStatus> entries, UUID collectorId) {
        return entries.stream()
                .filter(entry -> entry.collectorId().equals(collectorId))
                .findFirst()
                .orElseThrow();
    }

    private void seedStaleCollector() {
        jdbcTemplate.update(
                """
                INSERT INTO users (id, name, phone_number, password_hash, role, is_active, created_at)
                VALUES (?, 'Stale Collector', '0772222222',
                '$2a$10$KHK5f8Lz/uT8/0S91J9LRe4hF/t08qH7wR/70P71k0T8y.4XJ7.sC', 'DATA_COLLECTOR', true, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO NOTHING
                """,
                staleCollectorId
        );
    }

    private void seedSubmissions() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        SubmissionRepositoryAdapter repository = new SubmissionRepositoryAdapter(
                submissionJpaRepository,
                submissionMapper,
                null,
                adminReceiptStatusQueryJpaRepository
        );

        repository.save(createSubmission("Primary Sync One", primaryCollectorId, SubmissionStatus.SYNCED));
        repository.save(createSubmission("Primary Sync Two", primaryCollectorId, SubmissionStatus.SYNCED));
        repository.save(createSubmission("Primary Flagged", primaryCollectorId, SubmissionStatus.FLAGGED));
        repository.save(createSubmission("Primary Duplicate", primaryCollectorId, SubmissionStatus.DUPLICATE));

        BypSubmission staleSubmission = createSubmission("Stale Sync", staleCollectorId, SubmissionStatus.SYNCED);
        repository.save(staleSubmission);
        jdbcTemplate.update(
                "UPDATE submissions SET synced_at = ? WHERE id = ?",
                LocalDateTime.now().minusHours(72),
                staleSubmission.getId()
        );
    }

    private BypSubmission createSubmission(String name, UUID collectorId, SubmissionStatus status) {
        UUID deviceSubmissionId = UUID.randomUUID();
        BypSubmission submission = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0)),
                new Location(
                        TestLocationFixtures.KAMPALA_DISTRICT_ID,
                        TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                        TestLocationFixtures.KAMPALA_PARISH_ID,
                        TestLocationFixtures.KAMPALA_VILLAGE_ID
                ),
                name,
                nextUniquePhone(),
                "FEMALE",
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
        submission.setStatus(status);
        return submission;
    }

    private String nextUniquePhone() {
        return String.format("0772%07d", phoneSequence.getAndIncrement());
    }
}
