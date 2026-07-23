package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.application.services.PublicDashboardFilterMapper;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.IypSubmission;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
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
@Import({DashboardAggregationJpaRepository.class, DashboardAggregationRepositoryAdapter.class})
class PublicDashboardAggregationIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DashboardAggregationRepositoryPort aggregationRepository;

    private SubmissionRepositoryPort submissionRepository;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(submissionJpaRepository, submissionMapper, null, null);
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);
        saveSampleSubmissions();
    }

    @Test
    void publicFilterShouldMatchAdminAndSemanticsForGenderAndFormType() {
        PublicDashboardFilter publicFilter = new PublicDashboardFilter(
                null, null, null, FormType.BYP, null, null, "FEMALE", null, null
        );
        DashboardFilter dashboardFilter = PublicDashboardFilterMapper.toDashboardFilter(publicFilter);

        assertThat(aggregationRepository.countTotal(dashboardFilter)).isEqualTo(2L);
        assertThat(aggregationRepository.countByFormType(dashboardFilter))
                .containsExactly(new FormTypeCount(FormType.BYP, 2L));
        assertThat(aggregationRepository.countByGender(dashboardFilter))
                .containsExactly(new GenderCount("FEMALE", 2L));
    }

    @Test
    void shouldAggregateAgeGroupsForPublicCharts() {
        assertThat(aggregationRepository.countByAgeGroup(DashboardFilter.empty()))
                .contains(
                        new AgeGroupCount("AGE_20_24", 3L),
                        new AgeGroupCount("AGE_15_19", 1L)
                );
    }

    @Test
    @Tag("slow")
    void heatmapEntriesShouldIncludeDistrictIdsAndCountsWithoutRespondentIdentifiers() {
        List<HeatmapEntry> entries = aggregationRepository.countHeatmap(DashboardFilter.empty());

        assertThat(entries).isNotEmpty();
        assertThat(entries).allSatisfy(entry -> {
            assertThat(entry.districtId()).isNotNull();
            assertThat(entry.label()).isNotBlank();
            assertThat(entry.count()).isPositive();
            assertThat(entry.label()).doesNotContainPattern("\\d{9,}");
        });
        assertThat(entries).anyMatch(entry ->
                TestLocationFixtures.NTUNGAMO_DISTRICT_NAME.equals(entry.label()) && entry.count() == 3L
        );
    }

    @Test
    @Tag("slow")
    void heatmapShouldDrillDownToParishWhenDistrictFilterApplied() {
        DashboardFilter filter = new DashboardFilter(
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID, null, null, null, null, null, null, null, null, null
        );

        List<HeatmapEntry> entries = aggregationRepository.countHeatmap(filter);

        assertThat(entries).isNotEmpty();
        assertThat(entries).allSatisfy(entry -> {
            assertThat(entry.districtId()).isEqualTo(TestLocationFixtures.NTUNGAMO_DISTRICT_ID);
            assertThat(entry.parishId()).isNotNull();
        });
    }

    private void saveSampleSubmissions() {
        submissionRepository.save(createByp("Jane One", "FEMALE", TestLocationFixtures.ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("Jane Two", "FEMALE", TestLocationFixtures.ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("John Three", "MALE", TestLocationFixtures.ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createIyp("John Four", "MALE", TestLocationFixtures.kampalaLocation(), UUID.randomUUID()));
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
