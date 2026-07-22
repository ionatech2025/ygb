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
    private final UUID aruaDistrictId = UUID.fromString("d1111111-1111-1111-1111-111111111111");
    private final UUID aruaSubcountyId = UUID.fromString("e2222222-2222-2222-2222-222222222222");
    private final UUID aruaParishId = UUID.fromString("b3333333-3333-3333-3333-333333333333");
    private final UUID aruaVillageId = UUID.fromString("f4444444-4444-4444-4444-444444444444");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(submissionJpaRepository, submissionMapper);
        submissionRepository.save(sampleByp(UUID.randomUUID()));
    }

    @Test
    void shouldReturnDistrictsAndDistinctSubmissionValues() {
        assertThat(optionsRepository.findDistricts())
                .extracting(FilterLocationOption::name)
                .contains("Arua");

        assertThat(optionsRepository.findSubcountiesByDistrict(aruaDistrictId))
                .extracting(FilterLocationOption::name)
                .contains("Arua Hill");

        assertThat(optionsRepository.findParishesBySubcounty(aruaSubcountyId))
                .extracting(FilterLocationOption::name)
                .contains("Mvara");

        assertThat(optionsRepository.findDistinctGenders()).contains("FEMALE");
        assertThat(optionsRepository.findDistinctAgeGroups()).contains("AGE_20_24");
        assertThat(optionsRepository.findDistinctFinancialYearPeriods()).contains("JAN_JUN_2026");
    }

    private BypSubmission sampleByp(UUID deviceSubmissionId) {
        return new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0)),
                new Location(aruaDistrictId, aruaSubcountyId, aruaParishId, aruaVillageId),
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
