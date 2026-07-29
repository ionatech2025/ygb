package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.ActiveFiscalYearSettingMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.ActiveFiscalYearSettingJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.application.services.GetActiveFiscalYearService;
import com.ionatech.nac.ygb.application.services.GetSubmissionDetailService;
import com.ionatech.nac.ygb.application.services.SubmitSubmissionService;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.service.LgoFiscalYearRecordsPolicy;
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
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that submissions persist the authenticated collector id and that admin detail/list
 * queries expose collector attribution for every PDM form type (issue backend/006).
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AdminSubmissionQueryJpaRepository.class})
class EnumeratorAttributionIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private AdminSubmissionQueryJpaRepository adminSubmissionQueryJpaRepository;

    @Autowired
    private ActiveFiscalYearSettingJpaRepository activeFiscalYearSettingJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private SubmitSubmissionService submitSubmissionService;
    private GetSubmissionDetailService getSubmissionDetailService;
    private SubmissionRepositoryPort submissionRepository;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final LocalDateTime completedAt = LocalDateTime.of(2026, 7, 28, 10, 0);

    @BeforeEach
    void setUp() {
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);

        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(
                submissionJpaRepository,
                submissionMapper,
                adminSubmissionQueryJpaRepository,
                null
        );

        ActiveFiscalYearSettingMapper fiscalYearMapper = Mappers.getMapper(ActiveFiscalYearSettingMapper.class);
        GetActiveFiscalYearUseCase getActiveFiscalYearUseCase = new GetActiveFiscalYearService(
                new ActiveFiscalYearSettingRepositoryAdapter(activeFiscalYearSettingJpaRepository, fiscalYearMapper)
        );

        submitSubmissionService = new SubmitSubmissionService(
                submissionRepository,
                getActiveFiscalYearUseCase,
                new LgoFiscalYearRecordsPolicy()
        );
        getSubmissionDetailService = new GetSubmissionDetailService(submissionRepository);
    }

    @Test
    void collectorSubmitByp_adminDetailIncludesCollectorIdMatchingAuthenticatedUser() {
        assertCollectorAttributionRoundTrip(
                FormType.BYP,
                submitSubmissionService.submit(bypCommand("0772112001"))
        );
    }

    @Test
    void collectorSubmitIyp_adminDetailIncludesCollectorIdMatchingAuthenticatedUser() {
        assertCollectorAttributionRoundTrip(
                FormType.IYP,
                submitSubmissionService.submit(iypCommand("0772112002"))
        );
    }

    @Test
    void collectorSubmitLgo_adminDetailIncludesCollectorIdMatchingAuthenticatedUser() {
        assertCollectorAttributionRoundTrip(
                FormType.LGO,
                submitSubmissionService.submit(lgoCommand("0772112003"))
        );
    }

    @Test
    void collectorSubmitPc_adminDetailIncludesCollectorIdMatchingAuthenticatedUser() {
        assertCollectorAttributionRoundTrip(
                FormType.PC,
                submitSubmissionService.submit(pcCommand("0772112004"))
        );
    }

    private void assertCollectorAttributionRoundTrip(FormType formType, Submission saved) {
        AdminSubmissionDetail detail = getSubmissionDetailService.getById(saved.getId());

        assertThat(detail.submission().getMetadata().collectorId()).isEqualTo(collectorId);
        assertThat(detail.submission().getFormType()).isEqualTo(formType);
        assertThat(detail.submission().getMetadata().formCompletedAt()).isEqualTo(completedAt);
        assertThat(detail.syncedAt()).isNotNull();

        SubmissionPage listPage = submissionRepository.findSummariesByFilter(
                new DashboardFilter(null, null, null, formType, null, null, null, null, null, null),
                PageRequest.of(0, 25)
        );

        SubmissionSummary summary = listPage.items().stream()
                .filter(item -> item.id().equals(saved.getId()))
                .findFirst()
                .orElseThrow();

        assertThat(summary.collectorId()).isEqualTo(collectorId);
        assertThat(summary.collectorName()).isEqualTo("Default Collector");
        assertThat(summary.formType()).isEqualTo(formType);
        assertThat(summary.formCompletedAt()).isEqualTo(completedAt);
        assertThat(summary.syncedAt()).isNotNull();
    }

    private BypSubmitCommand bypCommand(String phone) {
        return new BypSubmitCommand(
                collectorId,
                UUID.randomUUID(),
                completedAt,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                "Jane Doe",
                phone,
                "FEMALE",
                AgeGroup.AGE_18_24,
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
                "Provide more technical support and early training."
        );
    }

    private IypSubmitCommand iypCommand(String phone) {
        return new IypSubmitCommand(
                collectorId,
                UUID.randomUUID(),
                completedAt,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                "John Doe",
                phone,
                "MALE",
                AgeGroup.AGE_18_24,
                false,
                null,
                null,
                null,
                null,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                null,
                "Make information more accessible in rural areas."
        );
    }

    private LgoSubmitCommand lgoCommand(String phone) {
        return new LgoSubmitCommand(
                collectorId,
                UUID.randomUUID(),
                completedAt,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                "Official Name",
                phone,
                "FEMALE",
                AgeGroup.AGE_ABOVE_35,
                List.of(
                        new FiscalYearRecord("2025/26", 100000L, 80000L, 50, 20, 12, 8, 5, 4),
                        new FiscalYearRecord("2024/25", 90000L, 70000L, 45, 18, 10, 8, 5, 3)
                ),
                true,
                true,
                true,
                true,
                true,
                null,
                true,
                null,
                "Provide more monitoring tools."
        );
    }

    private PcSubmitCommand pcCommand(String phone) {
        return new PcSubmitCommand(
                collectorId,
                UUID.randomUUID(),
                completedAt,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                "Parish Chief Name",
                phone,
                "MALE",
                AgeGroup.AGE_ABOVE_35,
                1500000L,
                1500000L,
                100,
                40,
                30,
                10,
                "Lack of transport equipment is the main obstacle.",
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                PdcEffectivenessRating.VERY_EFFECTIVE,
                List.of("CAO"),
                null,
                "Regular field checks performed by the parish team.",
                true,
                true,
                "Improvements seen in poultry sectors.",
                true,
                "Reports submitted quarterly.",
                10,
                8,
                "Provide more monitoring tools for parish chiefs."
        );
    }
}
