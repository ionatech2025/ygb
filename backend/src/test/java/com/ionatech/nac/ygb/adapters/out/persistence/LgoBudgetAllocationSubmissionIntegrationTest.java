package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.LgoBudgetAllocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.LgoBudgetAllocationJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationCommand;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationResult;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.application.services.RecordLgoBudgetAllocationService;
import com.ionatech.nac.ygb.application.services.SaveLgoBudgetAllocationService;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
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
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class LgoBudgetAllocationSubmissionIntegrationTest {

    private static final UUID COLLECTOR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private LgoBudgetAllocationJpaRepository lgoBudgetAllocationJpaRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RecordLgoBudgetAllocationService recordService;

    @BeforeEach
    void setUp() {
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);

        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        LgoBudgetAllocationMapper allocationMapper = Mappers.getMapper(LgoBudgetAllocationMapper.class);

        SubmissionRepositoryAdapter submissionRepository = new SubmissionRepositoryAdapter(
                submissionJpaRepository,
                submissionMapper,
                null,
                null
        );
        LgoBudgetAllocationRepositoryAdapter allocationRepository = new LgoBudgetAllocationRepositoryAdapter(
                lgoBudgetAllocationJpaRepository,
                allocationMapper
        );
        SaveLgoBudgetAllocationService saveAllocationService = new SaveLgoBudgetAllocationService(allocationRepository);

        UserRepositoryPort userRepositoryPort = mock(UserRepositoryPort.class);
        when(userRepositoryPort.findById(COLLECTOR_ID)).thenReturn(Optional.of(collectorUser()));

        recordService = new RecordLgoBudgetAllocationService(
                userRepositoryPort,
                submissionRepository,
                saveAllocationService
        );
    }

    @Test
    void shouldPersistSubmissionEnvelopeAndAllocationPayload() {
        UUID deviceSubmissionId = UUID.randomUUID();
        RecordLgoBudgetAllocationCommand command = new RecordLgoBudgetAllocationCommand(
                COLLECTOR_ID,
                deviceSubmissionId,
                LocalDateTime.of(2026, 3, 15, 10, 0),
                "District Health Officer",
                "0772555666",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                Map.of(
                        "health", Map.of("amount", 1_200_000, "percentage", 28),
                        "education", Map.of("amount", 900_000, "percentage", 22)
                ),
                "Health and education received the largest shares due to service delivery gaps.",
                "Increase agriculture extension funding and climate resilience programmes."
        );

        RecordLgoBudgetAllocationResult result = recordService.record(command);

        assertThat(result.status()).isEqualTo("SYNCED");
        assertThat(submissionJpaRepository.findByDeviceSubmissionId(deviceSubmissionId)).isPresent();
        assertThat(submissionJpaRepository.findByDeviceSubmissionId(deviceSubmissionId).orElseThrow().getFormType())
                .isEqualTo("LGO_BUDGET_ALLOCATION");

        Map<String, Object> row = jdbcTemplate.queryForMap(
                "SELECT previous_fy_allocations, rationale, recommendations FROM lgo_budget_allocations WHERE lba_id = ?",
                result.lbaId()
        );
        assertThat(row.get("rationale")).isEqualTo(command.rationale());
        assertThat(row.get("recommendations")).isEqualTo(command.recommendations());
        assertThat(row.get("previous_fy_allocations").toString()).contains("health");
        assertThat(row.get("previous_fy_allocations").toString()).contains("education");
    }

    private User collectorUser() {
        return new User(
                COLLECTOR_ID,
                "Test Collector",
                "0711111111",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.of(2026, 1, 1, 0, 0)
        );
    }
}
