package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.LgoBudgetAllocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.LgoBudgetAllocationJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationRepositoryPort;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import com.ionatech.nac.ygb.domain.valueobjects.PriorYearAllocationBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.Rationale;
import com.ionatech.nac.ygb.domain.valueobjects.Recommendation;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class LgoBudgetAllocationRepositoryAdapterTest {

    private static final UUID COLLECTOR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    private static final Map<String, Object> ALLOCATIONS = Map.of(
            "health", Map.of("amount", 1_200_000, "percentage", 28),
            "education", Map.of("amount", 900_000, "percentage", 22)
    );

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private LgoBudgetAllocationJpaRepository jpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private LgoBudgetAllocationRepositoryPort adapter;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM lgo_budget_allocations");
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);
        LgoBudgetAllocationMapper mapper = Mappers.getMapper(LgoBudgetAllocationMapper.class);
        adapter = new LgoBudgetAllocationRepositoryAdapter(jpaRepository, mapper);
    }

    @Test
    void shouldSaveAllocationLinkedToExistingSubmission() {
        UUID submissionId = insertSubmission();

        LgoBudgetAllocation allocation = LgoBudgetAllocation.recordNew(
                submissionId,
                new PriorYearAllocationBreakdown(ALLOCATIONS),
                new Rationale("Health and education received the largest shares due to service delivery gaps."),
                new Recommendation("Increase agriculture extension funding and climate resilience programmes."),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );

        LgoBudgetAllocation saved = adapter.save(allocation);

        assertThat(saved.getLbaId()).isEqualTo(allocation.getLbaId());
        assertThat(saved.getSubmissionId()).isEqualTo(submissionId);
        assertThat(saved.getPreviousFyAllocations()).isEqualTo(ALLOCATIONS);
        assertThat(adapter.findById(saved.getLbaId())).isPresent();
    }

    @Test
    void shouldRejectMissingSubmissionForeignKey() {
        LgoBudgetAllocation allocation = LgoBudgetAllocation.recordNew(
                UUID.randomUUID(),
                new PriorYearAllocationBreakdown(ALLOCATIONS),
                new Rationale("Health and education received the largest shares due to service delivery gaps."),
                new Recommendation("Increase agriculture extension funding and climate resilience programmes."),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );

        assertThatThrownBy(() -> adapter.save(allocation))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    private UUID insertSubmission() {
        UUID submissionId = UUID.randomUUID();
        jdbcTemplate.update(
                """
                        INSERT INTO submissions (
                            id, collector_id, device_submission_id, form_completed_at, financial_year_period,
                            status, district_id, subcounty_id, parish_id, village_id,
                            respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                submissionId,
                COLLECTOR_ID,
                UUID.randomUUID(),
                LocalDateTime.of(2026, 3, 15, 10, 0),
                "JAN_JUN_2026",
                "SYNCED",
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                "District Health Officer",
                "0772555666",
                "FEMALE",
                "AGE_30_AND_ABOVE",
                "LGO"
        );
        return submissionId;
    }
}
