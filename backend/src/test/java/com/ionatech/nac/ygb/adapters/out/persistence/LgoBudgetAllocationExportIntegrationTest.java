package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.export.LgoBudgetAllocationCsvExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.LgoBudgetAllocationExportAdapter;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.LgoBudgetAllocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.LgoBudgetAllocationJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.ExportLgoBudgetAllocationDatasetUseCase;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationCommand;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.application.services.DashboardFilterHierarchyValidator;
import com.ionatech.nac.ygb.application.services.ExportLgoBudgetAllocationDatasetService;
import com.ionatech.nac.ygb.application.services.RecordLgoBudgetAllocationService;
import com.ionatech.nac.ygb.application.services.SaveLgoBudgetAllocationService;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationAnonymisedRecord;
import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;
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

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({
        LgoBudgetAllocationDashboardJpaRepository.class,
        LgoBudgetAllocationDashboardReadAdapter.class,
        LgoBudgetAllocationCsvExportWriter.class,
        LgoBudgetAllocationExportAdapter.class
})
class LgoBudgetAllocationExportIntegrationTest {

    private static final UUID COLLECTOR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private LgoBudgetAllocationJpaRepository lgoBudgetAllocationJpaRepository;

    @Autowired
    private LgoBudgetAllocationDashboardReadAdapter readAdapter;

    @Autowired
    private LgoBudgetAllocationExportAdapter exportAdapter;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ExportLgoBudgetAllocationDatasetUseCase exportService;
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
        exportService = new ExportLgoBudgetAllocationDatasetService(
                readAdapter,
                new DashboardFilterHierarchyValidator(id -> Optional.empty()),
                exportAdapter,
                new AnonymisationProjector()
        );

        recordService.record(kampalaCommand(UUID.randomUUID(), "0772111111", Map.of(
                "health", Map.of("amount", 1_200_000, "percentage", 28),
                "education", Map.of("amount", 900_000, "percentage", 22)
        )));
        recordService.record(kampalaCommand(UUID.randomUUID(), "0772222222", Map.of(
                "health", Map.of("amount", 800_000, "percentage", 35)
        )));
        recordService.record(ntungamoCommand(UUID.randomUUID(), "0773333333", Map.of(
                "agriculture", Map.of("amount", 600_000, "percentage", 40)
        )));
    }

    @Test
    void shouldExportCsvFilteredByDistrictWithoutPiiColumns() {
        LgoBudgetAllocationDashboardFilter filter = new LgoBudgetAllocationDashboardFilter(
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                null, null, null, null, null, null, null
        );

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(filter, output);

        List<String> lines = output.toString(StandardCharsets.UTF_8).lines().toList();
        assertThat(lines).hasSize(3);
        assertThat(lines.getFirst()).isEqualTo(String.join(",", LgoBudgetAllocationAnonymisedRecord.EXPORT_HEADERS));
        assertThat(headerTokens(lines.getFirst())).noneMatch(this::looksLikePiiHeader);
        assertThat(lines.stream().skip(1))
                .allMatch(line -> line.contains(TestLocationFixtures.KAMPALA_DISTRICT_NAME)
                        && !line.contains(TestLocationFixtures.NTUNGAMO_DISTRICT_NAME)
                        && !line.contains("District Health Officer")
                        && !line.contains("0772")
                        && !line.contains("Health and education received"));
    }

    @Test
    void shouldExportFullDatasetWithoutFilters() {
        ByteArrayOutputStream csvOutput = new ByteArrayOutputStream();
        exportService.export(LgoBudgetAllocationDashboardFilter.empty(), csvOutput);
        assertThat(csvOutput.toString(StandardCharsets.UTF_8).lines().count()).isEqualTo(4L);
    }

    private List<String> headerTokens(String headerLine) {
        return Arrays.stream(headerLine.split(",")).map(String::trim).toList();
    }

    private boolean looksLikePiiHeader(String header) {
        String normalized = header.replace(" ", "").replace("_", "").toLowerCase(Locale.ROOT);
        return AnonymisationProjector.PII_JSON_KEYS.contains(normalized);
    }

    private RecordLgoBudgetAllocationCommand kampalaCommand(
            UUID deviceSubmissionId,
            String phone,
            Map<String, Object> allocations
    ) {
        return command(
                deviceSubmissionId,
                phone,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                TestLocationFixtures.KAMPALA_SUBCOUNTY_ID,
                TestLocationFixtures.KAMPALA_PARISH_ID,
                TestLocationFixtures.KAMPALA_VILLAGE_ID,
                allocations
        );
    }

    private RecordLgoBudgetAllocationCommand ntungamoCommand(
            UUID deviceSubmissionId,
            String phone,
            Map<String, Object> allocations
    ) {
        return command(
                deviceSubmissionId,
                phone,
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID,
                TestLocationFixtures.NTUNGAMO_SUBCOUNTY_ID,
                TestLocationFixtures.NTUNGAMO_PARISH_ID,
                TestLocationFixtures.NTUNGAMO_VILLAGE_ID,
                allocations
        );
    }

    private RecordLgoBudgetAllocationCommand command(
            UUID deviceSubmissionId,
            String phone,
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            UUID villageId,
            Map<String, Object> allocations
    ) {
        return new RecordLgoBudgetAllocationCommand(
                COLLECTOR_ID,
                deviceSubmissionId,
                LocalDateTime.of(2026, 3, 15, 10, 0),
                "District Health Officer",
                phone,
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                districtId,
                subcountyId,
                parishId,
                villageId,
                allocations,
                "Health and education received the largest shares due to service delivery gaps.",
                "Increase agriculture extension funding and climate resilience programmes."
        );
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
