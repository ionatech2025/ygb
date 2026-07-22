package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class SubmissionRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    private SubmissionMapper submissionMapper;
    private SubmissionRepositoryPort adapter;

    // Seeded IDs from Flyway V2 & V3 migrations
    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final UUID districtId = UUID.fromString("d1111111-1111-1111-1111-111111111111");
    private final UUID subcountyId = UUID.fromString("e2222222-2222-2222-2222-222222222222");
    private final UUID parishId = UUID.fromString("b3333333-3333-3333-3333-333333333333");
    private final UUID villageId = UUID.fromString("f4444444-4444-4444-4444-444444444444");

    private SubmissionMetadata createMetadata(UUID deviceSubmissionId) {
        return new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.now());
    }

    private Location createLocation() {
        return new Location(districtId, subcountyId, parishId, villageId);
    }

    @BeforeEach
    void setUp() {
        submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        adapter = new SubmissionRepositoryAdapter(submissionJpaRepository, submissionMapper, null, null);
    }

    @Test
    void shouldSaveAndRetrieveBypSubmission() {
        BypSubmission byp = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe",
                "0772111222",
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
                List.of("TRAINING", "MARKET_LINKAGES"),
                new NarrativeText("Provide more technical support.")
        );

        Submission saved = adapter.save(byp);
        assertThat(saved).isNotNull();

        Submission retrieved = submissionJpaRepository.findById(saved.getId())
                .map(submissionMapper::toDomain)
                .orElse(null);

        assertThat(retrieved).isInstanceOf(BypSubmission.class);
        BypSubmission retrievedByp = (BypSubmission) retrieved;
        assertThat(retrievedByp.getRespondentName()).isEqualTo("Jane Doe");
        assertThat(retrievedByp.getExactAge().getValue()).isEqualTo(22);
        assertThat(retrievedByp.getBdsServices()).containsExactly("TRAINING", "MARKET_LINKAGES");
    }

    @Test
    void shouldSaveAndRetrieveIypSubmission() {
        IypSubmission iyp = new IypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "John Doe",
                "0772111333",
                "MALE",
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
                new NarrativeText("Make information more accessible.")
        );

        Submission saved = adapter.save(iyp);
        assertThat(saved).isNotNull();

        Submission retrieved = submissionJpaRepository.findById(saved.getId())
                .map(submissionMapper::toDomain)
                .orElse(null);

        assertThat(retrieved).isInstanceOf(IypSubmission.class);
        IypSubmission retrievedIyp = (IypSubmission) retrieved;
        assertThat(retrievedIyp.getRejectionNarrative().getValue()).isEqualTo("Application rejected without clear feedback.");
        assertThat(retrievedIyp.getInformationChannels()).containsExactly("RADIO");
        assertThat(retrievedIyp.getReasonsForNotApplying()).containsExactly("LACK_OF_COLLATERAL");
    }

    @Test
    void shouldSaveAndRetrieveLgoSubmission() {
        LgoSubmission lgo = new LgoSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                List.of(new FiscalYearRecord("2024/25", 100000L, 80000L, 50, 20, 20, 5, 4)),
                true,
                true,
                true,
                true,
                true,
                null,
                true,
                null,
                new NarrativeText("Provide more monitoring tools.")
        );

        Submission saved = adapter.save(lgo);
        assertThat(saved).isNotNull();

        Submission retrieved = submissionJpaRepository.findById(saved.getId())
                .map(submissionMapper::toDomain)
                .orElse(null);

        assertThat(retrieved).isInstanceOf(LgoSubmission.class);
        LgoSubmission retrievedLgo = (LgoSubmission) retrieved;
        assertThat(retrievedLgo.getFiscalYearRecords()).hasSize(1);
        FiscalYearRecord record = retrievedLgo.getFiscalYearRecords().get(0);
        assertThat(record.fiscalYearLabel()).isEqualTo("2024/25");
        assertThat(record.expectedFunds()).isEqualTo(100000L);
    }

    @Test
    void shouldSaveAndRetrievePcSubmission() {
        PcSubmission pc = new PcSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_30_AND_ABOVE,
                1500000L,
                1500000L,
                100,
                40,
                30,
                new NarrativeText("Lack of transport equipment is the main obstacle."),
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                "HIGHLY_EFFECTIVE",
                List.of("CAO"),
                null,
                new NarrativeText("Regular fields checks performed."),
                true,
                true,
                new NarrativeText("Improvements seen in poultry sectors."),
                true,
                new NarrativeText("Reports submitted quarterly."),
                10,
                8
        );

        Submission saved = adapter.save(pc);
        assertThat(saved).isNotNull();

        Submission retrieved = submissionJpaRepository.findById(saved.getId())
                .map(submissionMapper::toDomain)
                .orElse(null);

        assertThat(retrieved).isInstanceOf(PcSubmission.class);
        PcSubmission retrievedPc = (PcSubmission) retrieved;
        assertThat(retrievedPc.getAmountExpected()).isEqualTo(1500000L);
        assertThat(retrievedPc.getMonitoredBy()).containsExactly("CAO");
    }

    @Test
    void shouldThrowExceptionWhenDuplicateDeviceSubmissionIdSaved() {
        UUID duplicateDeviceId = UUID.randomUUID();

        BypSubmission byp1 = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(duplicateDeviceId),
                createLocation(),
                "Jane Doe",
                "0772111222",
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

        BypSubmission byp2 = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(duplicateDeviceId), // same device ID
                createLocation(),
                "Other Name",
                "0772111223",
                "MALE",
                AgeGroup.AGE_20_24,
                new Age(23),
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

        adapter.save(byp1);

        // Flushes to DB to trigger unique constraint check
        assertThatThrownBy(() -> {
            adapter.save(byp2);
            submissionJpaRepository.flush();
        }).isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void shouldCountDailySubmissionsByCollectorId() {
        UUID otherCollectorId = UUID.fromString("11111111-1111-1111-1111-111111111111");

        BypSubmission byp1 = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(collectorId, UUID.randomUUID(), LocalDateTime.now()),
                createLocation(),
                "Jane Doe",
                "0772111222",
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

        BypSubmission byp2 = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(otherCollectorId, UUID.randomUUID(), LocalDateTime.now()),
                createLocation(),
                "Other Doe",
                "0772111223",
                "MALE",
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

        adapter.save(byp1);
        adapter.save(byp2);

        LocalDateTime startOfDay = LocalDateTime.now().with(java.time.LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(java.time.LocalTime.MAX);

        long count = adapter.countByCollectorIdAndFormCompletedAtBetween(collectorId, startOfDay, endOfDay);
        assertThat(count).isEqualTo(1L);

        long otherCount = adapter.countByCollectorIdAndFormCompletedAtBetween(otherCollectorId, startOfDay, endOfDay);
        assertThat(otherCount).isEqualTo(1L);
    }

    @Test
    void shouldCheckExistsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus() {
        BypSubmission byp = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe",
                "0772111222",
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
        byp.setStatus(SubmissionStatus.SYNCED);
        adapter.save(byp);

        String fyPeriod = byp.getMetadata().financialYearPeriod().toString();

        boolean existsSynced = adapter.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                "0772111222", FormType.BYP, fyPeriod, SubmissionStatus.SYNCED
        );
        assertThat(existsSynced).isTrue();

        boolean existsPending = adapter.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                "0772111222", FormType.BYP, fyPeriod, SubmissionStatus.PENDING
        );
        assertThat(existsPending).isFalse();

        boolean existsOtherPhone = adapter.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                "0772111223", FormType.BYP, fyPeriod, SubmissionStatus.SYNCED
        );
        assertThat(existsOtherPhone).isFalse();

        boolean existsOtherType = adapter.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                "0772111222", FormType.IYP, fyPeriod, SubmissionStatus.SYNCED
        );
        assertThat(existsOtherType).isFalse();
    }

    @Test
    void shouldFailToSaveDuplicateSyncedSubmissionsDueToUniqueConstraint() {
        BypSubmission byp1 = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe",
                "0772111222",
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
        byp1.setStatus(SubmissionStatus.SYNCED);

        BypSubmission byp2 = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe Duplicate",
                "0772111222", // same phone
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
        byp2.setStatus(SubmissionStatus.SYNCED); // both SYNCED

        adapter.save(byp1);

        assertThatThrownBy(() -> {
            adapter.save(byp2);
            submissionJpaRepository.flush();
        }).isInstanceOf(com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException.class);
    }

    @Test
    void shouldAllowDuplicateFlaggedSubmissions() {
        BypSubmission byp1 = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe",
                "0772111222",
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
        byp1.setStatus(SubmissionStatus.SYNCED);

        BypSubmission byp2 = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe Duplicate",
                "0772111222", // same phone
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
        byp2.setStatus(SubmissionStatus.FLAGGED); // FLAGGED, so duplicate is allowed

        adapter.save(byp1);
        Submission savedByp2 = adapter.save(byp2);
        submissionJpaRepository.flush();

        assertThat(savedByp2).isNotNull();
        assertThat(savedByp2.getStatus()).isEqualTo(SubmissionStatus.FLAGGED);
    }

    @Test
    void shouldCountSubmissionsByStatus() {
        BypSubmission pendingSub = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "Jane Doe",
                "0772111222",
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
        pendingSub.setStatus(SubmissionStatus.PENDING);

        BypSubmission syncedSub = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(UUID.randomUUID()),
                createLocation(),
                "John Doe",
                "0772111223",
                "MALE",
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
        syncedSub.setStatus(SubmissionStatus.SYNCED);

        adapter.save(pendingSub);
        adapter.save(syncedSub);

        long pendingCount = adapter.countByCollectorIdAndStatus(collectorId, SubmissionStatus.PENDING);
        long syncedCount = adapter.countByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED);

        assertThat(pendingCount).isEqualTo(1L);
        assertThat(syncedCount).isEqualTo(1L);
    }

    @Test
    void shouldFindLatestSyncedAtByCollectorIdAndStatus() {
        LocalDateTime formCompletedAt = LocalDateTime.of(2026, 7, 19, 10, 0);

        BypSubmission sub1 = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(collectorId, UUID.randomUUID(), formCompletedAt),
                createLocation(),
                "Jane Doe",
                "0772111222",
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
        sub1.setStatus(SubmissionStatus.SYNCED);

        BypSubmission sub2 = new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(collectorId, UUID.randomUUID(), formCompletedAt.minusDays(1)),
                createLocation(),
                "John Doe",
                "0772111223",
                "MALE",
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
        sub2.setStatus(SubmissionStatus.SYNCED);

        adapter.save(sub1);
        LocalDateTime afterFirstSave = adapter.findLatestSyncedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED)
                .orElseThrow();

        adapter.save(sub2);
        LocalDateTime afterSecondSave = adapter.findLatestSyncedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED)
                .orElseThrow();

        assertThat(afterSecondSave).isAfterOrEqualTo(afterFirstSave);
        assertThat(adapter.findLatestSyncedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.PENDING)).isEmpty();
    }
}
