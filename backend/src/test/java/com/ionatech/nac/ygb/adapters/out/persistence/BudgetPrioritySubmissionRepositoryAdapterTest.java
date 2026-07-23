package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.BudgetPrioritySubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.BudgetPrioritySubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPrioritySubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BudgetPrioritySubmissionRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private BudgetPrioritySubmissionJpaRepository jpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private BudgetPrioritySubmissionRepositoryPort adapter;

    private static final Map<String, Object> PRIORITY_AREAS = Map.of(
            "rankedAreas", List.of("PRIMARY_HEALTH_CARE", "MATERNAL_HEALTH")
    );

    private static final Map<String, Object> DEMOGRAPHICS = Map.of(
            "fullName", "Jane Nakato",
            "phoneNumber", "0772123456",
            "gender", "FEMALE",
            "ageGroup", "AGE_20_24",
            "districtId", UUID.randomUUID().toString()
    );

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("DELETE FROM budget_priority_submissions");
        BudgetPrioritySubmissionMapper mapper = Mappers.getMapper(BudgetPrioritySubmissionMapper.class);
        adapter = new BudgetPrioritySubmissionRepositoryAdapter(jpaRepository, mapper);
    }

    @Test
    void shouldSaveValidSubmission() {
        BudgetPrioritySubmission submission = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                PRIORITY_AREAS,
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );

        BudgetPrioritySubmission saved = adapter.save(submission);

        assertThat(saved.getBpId()).isEqualTo(submission.getBpId());
        assertThat(saved.getPhoneNumber().getValue()).isEqualTo("0772123456");
        assertThat(saved.getSection()).isEqualTo(BudgetPrioritySection.HEALTH);
        assertThat(saved.getFinancialYearPeriod().toString()).isEqualTo("JAN_JUN_2026");
        assertThat(saved.getPriorityAreas()).isEqualTo(PRIORITY_AREAS);
        assertThat(saved.getDemographicData()).isEqualTo(DEMOGRAPHICS);
    }

    @Test
    void shouldDetectExistingPhoneSectionAndPeriod() {
        BudgetPrioritySubmission first = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                PRIORITY_AREAS,
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
        adapter.save(first);

        assertThat(adapter.existsByPhoneSectionAndPeriod(
                "0772123456",
                BudgetPrioritySection.HEALTH,
                "JAN_JUN_2026"
        )).isTrue();
        assertThat(adapter.existsByPhoneSectionAndPeriod(
                "0772123456",
                BudgetPrioritySection.AGRICULTURE,
                "JAN_JUN_2026"
        )).isFalse();
    }

    @Test
    void shouldTranslateUniqueIndexViolationToDuplicateException() {
        BudgetPrioritySubmission first = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                PRIORITY_AREAS,
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
        adapter.save(first);

        BudgetPrioritySubmission duplicate = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                PRIORITY_AREAS,
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 4, 1, 9, 0)
        );

        assertThatThrownBy(() -> adapter.save(duplicate))
                .isInstanceOf(DuplicateBudgetPrioritySubmissionException.class);
    }

    @Test
    void shouldAllowSamePhoneAndPeriodForDifferentSection() {
        adapter.save(BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                PRIORITY_AREAS,
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        ));

        BudgetPrioritySubmission agriculture = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.AGRICULTURE,
                PhoneNumber.of("0772123456"),
                Map.of("rankedAreas", List.of("IRRIGATION", "SEEDS")),
                DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 20, 11, 0)
        );

        assertThat(adapter.save(agriculture).getSection()).isEqualTo(BudgetPrioritySection.AGRICULTURE);
    }
}
