package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityDashboardReadPort;
import com.ionatech.nac.ygb.application.services.SaveBudgetPrioritySubmissionService;
import com.ionatech.nac.ygb.application.services.SubmitBudgetPriorityService;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.BudgetPrioritySubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.BudgetPrioritySubmissionJpaRepository;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.service.FinancialYearPeriodCalculator;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityAreaCount;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDemographics;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPrioritySectionCount;
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

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BudgetPriorityDashboardJpaRepository.class, BudgetPriorityDashboardReadAdapter.class})
class BudgetPriorityDashboardAggregationIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-03-15T10:00:00Z"),
            ZoneOffset.UTC
    );

    @Autowired
    private BudgetPrioritySubmissionJpaRepository jpaRepository;

    @Autowired
    private BudgetPriorityDashboardReadPort readPort;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private SubmitBudgetPriorityService submitService;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("DELETE FROM budget_priority_submissions");
        BudgetPrioritySubmissionMapper mapper = Mappers.getMapper(BudgetPrioritySubmissionMapper.class);
        SaveBudgetPrioritySubmissionService saveService = new SaveBudgetPrioritySubmissionService(
                new BudgetPrioritySubmissionRepositoryAdapter(jpaRepository, mapper)
        );
        submitService = new SubmitBudgetPriorityService(
                saveService,
                new FinancialYearPeriodCalculator(),
                FIXED_CLOCK
        );

        submitService.submit(command(
                BudgetPrioritySection.HEALTH,
                "0772111111",
                TestLocationFixtures.KAMPALA_DISTRICT_ID.toString(),
                List.of("PRIMARY_HEALTH_CARE", "MATERNAL_HEALTH")
        ));
        submitService.submit(command(
                BudgetPrioritySection.HEALTH,
                "0772222222",
                TestLocationFixtures.KAMPALA_DISTRICT_ID.toString(),
                List.of("PRIMARY_HEALTH_CARE")
        ));
        submitService.submit(command(
                BudgetPrioritySection.AGRICULTURE,
                "0773333333",
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID.toString(),
                List.of("IRRIGATION")
        ));
    }

    @Test
    void summaryTotalsShouldMatchDatabaseCounts() {
        assertThat(readPort.countTotal(BudgetPriorityDashboardFilter.empty())).isEqualTo(3L);
        assertThat(readPort.countBySection(BudgetPriorityDashboardFilter.empty()))
                .containsExactlyInAnyOrder(
                        new BudgetPrioritySectionCount("health", 2L),
                        new BudgetPrioritySectionCount("agriculture", 1L)
                );
        assertThat(readPort.countTopPriorityAreas(BudgetPriorityDashboardFilter.empty(), 10))
                .hasSize(3);
        assertThat(readPort.countTopPriorityAreas(BudgetPriorityDashboardFilter.empty(), 10).getFirst())
                .isEqualTo(new BudgetPriorityAreaCount("PRIMARY_HEALTH_CARE", 2L));
        assertThat(readPort.countTopPriorityAreas(BudgetPriorityDashboardFilter.empty(), 10).subList(1, 3))
                .containsExactlyInAnyOrder(
                        new BudgetPriorityAreaCount("MATERNAL_HEALTH", 1L),
                        new BudgetPriorityAreaCount("IRRIGATION", 1L)
                );
    }

    @Test
    void sectionFilterShouldScopeCounts() {
        BudgetPriorityDashboardFilter healthFilter = new BudgetPriorityDashboardFilter(
                BudgetPrioritySection.HEALTH,
                null, null, null, null, null, null, null, null
        );

        assertThat(readPort.countTotal(healthFilter)).isEqualTo(2L);
        assertThat(readPort.countBySection(healthFilter))
                .containsExactly(new BudgetPrioritySectionCount("health", 2L));
    }

    @Test
    void districtFilterShouldScopeCounts() {
        BudgetPriorityDashboardFilter kampalaFilter = new BudgetPriorityDashboardFilter(
                null,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                null, null, null, null, null, null, null
        );

        assertThat(readPort.countTotal(kampalaFilter)).isEqualTo(2L);
    }

    private SubmitBudgetPriorityCommand command(
            BudgetPrioritySection section,
            String phone,
            String districtId,
            List<String> rankedAreas
    ) {
        return new SubmitBudgetPriorityCommand(
                section,
                Map.of(
                        BudgetPriorityDemographics.FULL_NAME, "Jane Nakato",
                        BudgetPriorityDemographics.PHONE_NUMBER, phone,
                        BudgetPriorityDemographics.AGE_GROUP, "AGE_20_24",
                        BudgetPriorityDemographics.GENDER, "FEMALE",
                        BudgetPriorityDemographics.DISTRICT_ID, districtId
                ),
                Map.of("rankedAreas", rankedAreas)
        );
    }
}
