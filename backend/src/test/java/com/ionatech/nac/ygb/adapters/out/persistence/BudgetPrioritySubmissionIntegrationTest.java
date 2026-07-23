package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.BudgetPrioritySubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.BudgetPrioritySubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.application.services.SaveBudgetPrioritySubmissionService;
import com.ionatech.nac.ygb.application.services.SubmitBudgetPriorityService;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.service.FinancialYearPeriodCalculator;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDemographics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BudgetPrioritySubmissionIntegrationTest {

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
    }

    @Test
    void shouldPersistFirstSubmissionAndBlockDuplicateForSamePhoneSectionAndPeriod() {
        SubmitBudgetPriorityCommand command = validCommand(BudgetPrioritySection.HEALTH);

        assertThat(submitService.submit(command).getSection()).isEqualTo(BudgetPrioritySection.HEALTH);

        assertThatThrownBy(() -> submitService.submit(command))
                .isInstanceOf(DuplicateBudgetPrioritySubmissionException.class);
    }

    private SubmitBudgetPriorityCommand validCommand(BudgetPrioritySection section) {
        return new SubmitBudgetPriorityCommand(
                section,
                Map.of(
                        BudgetPriorityDemographics.FULL_NAME, "Jane Nakato",
                        BudgetPriorityDemographics.PHONE_NUMBER, "0772123456",
                        BudgetPriorityDemographics.AGE_GROUP, "AGE_20_24",
                        BudgetPriorityDemographics.GENDER, "FEMALE",
                        BudgetPriorityDemographics.DISTRICT_ID, UUID.randomUUID().toString()
                ),
                Map.of("rankedAreas", List.of("PRIMARY_HEALTH_CARE"))
        );
    }
}
