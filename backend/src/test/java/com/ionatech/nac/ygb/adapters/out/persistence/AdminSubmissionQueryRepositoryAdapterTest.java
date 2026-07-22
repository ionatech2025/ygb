package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
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
@Import({AdminSubmissionQueryJpaRepository.class})
class AdminSubmissionQueryRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private AdminSubmissionQueryJpaRepository adminSubmissionQueryJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private SubmissionRepositoryPort submissionRepository;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(
                submissionJpaRepository,
                submissionMapper,
                adminSubmissionQueryJpaRepository,
                null
        );
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);
        saveSampleSubmissions();
    }

    @Test
    void shouldListSubmissionsFilteredByDistrict() {
        DashboardFilter ntungamoFilter = new DashboardFilter(
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID, null, null, null, null, null, null, null, null, null
        );

        SubmissionPage ntungamoPage = submissionRepository.findSummariesByFilter(ntungamoFilter, PageRequest.of(0, 25));

        assertThat(ntungamoPage.totalElements()).isEqualTo(3L);
        assertThat(ntungamoPage.items()).hasSize(3);
        assertThat(ntungamoPage.items()).allMatch(summary -> TestLocationFixtures.NTUNGAMO_DISTRICT_ID.equals(summary.districtId()));
        assertThat(ntungamoPage.items()).allMatch(summary -> TestLocationFixtures.NTUNGAMO_DISTRICT_NAME.equals(summary.districtName()));
        assertThat(ntungamoPage.items()).allMatch(summary -> "Default Collector".equals(summary.collectorName()));
    }

    @Test
    void shouldPaginateSubmissionSummaries() {
        SubmissionPage firstPage = submissionRepository.findSummariesByFilter(
                DashboardFilter.empty(),
                PageRequest.of(0, 2)
        );
        SubmissionPage secondPage = submissionRepository.findSummariesByFilter(
                DashboardFilter.empty(),
                PageRequest.of(1, 2)
        );

        assertThat(firstPage.totalElements()).isEqualTo(4L);
        assertThat(firstPage.items()).hasSize(2);
        assertThat(secondPage.items()).hasSize(2);
        assertThat(firstPage.totalPages()).isEqualTo(2);
    }

    @Test
    void shouldLoadSubmissionDetailById() {
        BypSubmission saved = (BypSubmission) submissionRepository.save(createByp(
                "Detail Respondent",
                "FEMALE",
                ntungamoLocation(),
                UUID.randomUUID()
        ));

        AdminSubmissionDetail detail = submissionRepository.findDetailById(saved.getId()).orElseThrow();

        assertThat(detail.submission()).isInstanceOf(BypSubmission.class);
        assertThat(detail.submission().getRespondentName()).isEqualTo("Detail Respondent");
        assertThat(detail.financialYearPeriod()).isNotBlank();
    }

    private void saveSampleSubmissions() {
        submissionRepository.save(createByp("Jane One", "FEMALE", ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("Jane Two", "FEMALE", ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("John Three", "MALE", ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createIyp("John Four", "MALE", kampalaLocation(), UUID.randomUUID()));
    }

    private Location ntungamoLocation() {
        return TestLocationFixtures.ntungamoLocation();
    }

    private Location kampalaLocation() {
        return TestLocationFixtures.kampalaLocation();
    }

    private SubmissionMetadata metadata(UUID deviceSubmissionId) {
        return new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private BypSubmission createByp(String name, String gender, Location location, UUID deviceSubmissionId) {
        return new BypSubmission(
                UUID.randomUUID(),
                metadata(deviceSubmissionId),
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

    private IypSubmission createIyp(String name, String gender, Location location, UUID deviceSubmissionId) {
        return new IypSubmission(
                UUID.randomUUID(),
                metadata(deviceSubmissionId),
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
