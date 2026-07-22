package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
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
@Import({DashboardAggregationJpaRepository.class, DashboardAggregationRepositoryAdapter.class})
class DashboardAggregationRepositoryAdapterTest {

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
    void shouldAggregateCountsByDistrictGenderAndFormType() {
        DashboardAggregates viaPort = loadAggregates(DashboardFilter.empty());

        assertThat(viaPort.totalSubmissions()).isEqualTo(4L);
        assertThat(viaPort.byDistrict()).hasSize(2);
        assertThat(viaPort.byDistrict()).anyMatch(row -> TestLocationFixtures.NTUNGAMO_DISTRICT_NAME.equals(row.districtName()) && row.count() == 3L);
        assertThat(viaPort.byDistrict()).anyMatch(row -> TestLocationFixtures.KAMPALA_DISTRICT_NAME.equals(row.districtName()) && row.count() == 1L);
        assertThat(viaPort.byGender()).contains(
                new GenderCount("FEMALE", 2L),
                new GenderCount("MALE", 2L)
        );
        assertThat(viaPort.byFormType()).contains(
                new FormTypeCount(FormType.BYP, 3L),
                new FormTypeCount(FormType.IYP, 1L)
        );
    }

    @Test
    void shouldApplyGenderAndFormTypeFiltersWithAndSemantics() {
        DashboardFilter filter = new DashboardFilter(
                null, null, null, FormType.BYP, null, null, "FEMALE", null, null, null
        );

        assertThat(aggregationRepository.countTotal(filter)).isEqualTo(2L);
        assertThat(aggregationRepository.countByFormType(filter))
                .containsExactly(new FormTypeCount(FormType.BYP, 2L));
        assertThat(aggregationRepository.countByGender(filter))
                .containsExactly(new GenderCount("FEMALE", 2L));
    }

    @Test
    void emptyFilterShouldReturnFullDatasetCount() {
        assertThat(aggregationRepository.countTotal(DashboardFilter.empty())).isEqualTo(4L);
    }

    @Test
    void shouldFilterByFinancialYearPeriod() {
        UUID julSubmissionId = UUID.randomUUID();
        submissionRepository.save(createByp(
                "July Respondent",
                "FEMALE",
                ntungamoLocation(),
                julSubmissionId,
                LocalDateTime.of(2026, 8, 1, 9, 0)
        ));

        DashboardFilter janJunFilter = new DashboardFilter(
                null, null, null, null, null, null, null, null, null, "JAN_JUN_2026"
        );

        assertThat(aggregationRepository.countTotal(janJunFilter)).isEqualTo(4L);
        assertThat(aggregationRepository.countTotal(DashboardFilter.empty())).isEqualTo(5L);
    }

    @Test
    void shouldFilterByDistrictAndFormTypeWithAndSemantics() {
        DashboardFilter filter = new DashboardFilter(
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID, null, null, FormType.BYP, null, null, null, null, null, null
        );

        assertThat(aggregationRepository.countTotal(filter)).isEqualTo(3L);
    }

    private DashboardAggregates loadAggregates(DashboardFilter filter) {
        return new DashboardAggregates(
                aggregationRepository.countTotal(filter),
                aggregationRepository.countByDistrict(filter),
                aggregationRepository.countByGender(filter),
                aggregationRepository.countOverTime(filter, TimeSeriesGranularity.DAY),
                aggregationRepository.countByFormType(filter),
                aggregationRepository.countByFinancialYearPeriod(filter)
        );
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
        return metadata(deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private SubmissionMetadata metadata(UUID deviceSubmissionId, LocalDateTime completedAt) {
        return new SubmissionMetadata(collectorId, deviceSubmissionId, completedAt);
    }

    private BypSubmission createByp(String name, String gender, Location location, UUID deviceSubmissionId) {
        return createByp(name, gender, location, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private BypSubmission createByp(
            String name,
            String gender,
            Location location,
            UUID deviceSubmissionId,
            LocalDateTime completedAt
    ) {
        return new BypSubmission(
                UUID.randomUUID(),
                metadata(deviceSubmissionId, completedAt),
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
