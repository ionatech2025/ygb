package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.valueobjects.*;
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
@Import({DashboardFilterOptionsJpaRepository.class, DashboardFilterOptionsRepositoryAdapter.class})
class DashboardFilterOptionsRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private DashboardFilterOptionsRepositoryPort optionsRepository;

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private SubmissionRepositoryPort submissionRepository;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final UUID kampalaDistrictId = UUID.fromString("6a4ec61c-d428-4a51-8af0-721f7d03d492");
    private final UUID kampalaSubcountyId = UUID.fromString("168009f9-1188-49fb-88e8-70c93e1b7be0");
    private final UUID kampalaParishId = UUID.fromString("9ffcadf2-8a59-46d6-8f3d-01ee344828d6");
    private final UUID kampalaVillageId = UUID.fromString("841802f1-87ab-4efd-83f2-c9156ed33459");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(submissionJpaRepository, submissionMapper, null, null);
        submissionRepository.save(sampleByp(UUID.randomUUID()));
    }

    @Test
    void shouldReturnDistrictsAndDistinctSubmissionValues() {
        assertThat(optionsRepository.findDistricts())
                .extracting(FilterLocationOption::name)
                .contains("Kampala", "Ntungamo");

        assertThat(optionsRepository.findSubcountiesByDistrict(kampalaDistrictId))
                .extracting(FilterLocationOption::name)
                .contains("Kampala Central Division");

        assertThat(optionsRepository.findParishesBySubcounty(kampalaSubcountyId))
                .extracting(FilterLocationOption::name)
                .contains("Kampala Central");

        assertThat(optionsRepository.findDistinctGenders()).contains("FEMALE");
        assertThat(optionsRepository.findDistinctAgeGroups()).contains("AGE_20_24");
        assertThat(optionsRepository.findDistinctFinancialYearPeriods()).contains("JAN_JUN_2026");
    }

    @Test
    void shouldReturnParishesForKampalaDivisionsPreviouslyNestedUnderSubdivisions() {
        UUID kawempeDivisionId = UUID.fromString("035d3d78-0ce5-4c50-829a-857edc00e50d");
        UUID rubagaDivisionId = UUID.fromString("cc1786a1-86c6-4380-81d1-c248bbd9f8d8");

        assertThat(optionsRepository.findParishesBySubcounty(kawempeDivisionId))
                .extracting(FilterLocationOption::name)
                .contains("Bwaise I", "Komamboga");

        assertThat(optionsRepository.findParishesBySubcounty(rubagaDivisionId))
                .extracting(FilterLocationOption::name)
                .contains("Kasubi", "Busega");
    }

    private BypSubmission sampleByp(UUID deviceSubmissionId) {
        return new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0)),
                new Location(kampalaDistrictId, kampalaSubcountyId, kampalaParishId, kampalaVillageId),
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
    }
}
