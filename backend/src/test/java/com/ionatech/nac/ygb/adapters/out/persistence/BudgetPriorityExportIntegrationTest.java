package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.export.BudgetPriorityCsvExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.BudgetPriorityExcelExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.BudgetPriorityExportAdapter;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.BudgetPrioritySubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.BudgetPrioritySubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.ExportBudgetPriorityDatasetQuery;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.application.services.DashboardFilterHierarchyValidator;
import com.ionatech.nac.ygb.application.services.ExportBudgetPriorityDatasetService;
import com.ionatech.nac.ygb.application.services.SaveBudgetPrioritySubmissionService;
import com.ionatech.nac.ygb.application.services.SubmitBudgetPriorityService;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.service.FinancialYearPeriodCalculator;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityAnonymisedRecord;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDemographics;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.testsupport.TestLocationFixtures;
import org.apache.poi.ss.usermodel.WorkbookFactory;
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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({
        BudgetPriorityDashboardJpaRepository.class,
        BudgetPriorityDashboardReadAdapter.class,
        BudgetPriorityCsvExportWriter.class,
        BudgetPriorityExcelExportWriter.class,
        BudgetPriorityExportAdapter.class
})
class BudgetPriorityExportIntegrationTest {

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
    private BudgetPriorityDashboardReadAdapter readAdapter;

    @Autowired
    private BudgetPriorityExportAdapter exportAdapter;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ExportBudgetPriorityDatasetQuery exportService;
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
        exportService = new ExportBudgetPriorityDatasetService(
                readAdapter,
                new DashboardFilterHierarchyValidator(id -> java.util.Optional.empty()),
                exportAdapter,
                new AnonymisationProjector()
        );

        submitService.submit(command(
                BudgetPrioritySection.HEALTH,
                "0772111111",
                TestLocationFixtures.KAMPALA_DISTRICT_ID.toString(),
                List.of("PRIMARY_HEALTH_CARE")
        ));
        submitService.submit(command(
                BudgetPrioritySection.HEALTH,
                "0772222222",
                TestLocationFixtures.KAMPALA_DISTRICT_ID.toString(),
                List.of("MATERNAL_HEALTH")
        ));
        submitService.submit(command(
                BudgetPrioritySection.AGRICULTURE,
                "0773333333",
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID.toString(),
                List.of("IRRIGATION")
        ));
    }

    @Test
    void shouldExportCsvFilteredByDistrictWithoutPiiColumns() throws Exception {
        BudgetPriorityDashboardFilter filter = new BudgetPriorityDashboardFilter(
                null,
                TestLocationFixtures.KAMPALA_DISTRICT_ID,
                null, null, null, null, null, null, null
        );

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(filter, ExportFormat.CSV, output);

        List<String> lines = output.toString(StandardCharsets.UTF_8).lines().toList();
        assertThat(lines).hasSize(3);
        assertThat(lines.getFirst()).isEqualTo(String.join(",", BudgetPriorityAnonymisedRecord.EXPORT_HEADERS));
        assertThat(headerTokens(lines.getFirst())).noneMatch(this::looksLikePiiHeader);
        assertThat(lines.stream().skip(1))
                .allMatch(line -> line.contains(TestLocationFixtures.KAMPALA_DISTRICT_NAME)
                        && !line.contains(TestLocationFixtures.NTUNGAMO_DISTRICT_NAME)
                        && !line.contains("Jane Nakato")
                        && !line.contains("0772"));
    }

    @Test
    void shouldExportFullDatasetWithoutFilters() throws Exception {
        ByteArrayOutputStream csvOutput = new ByteArrayOutputStream();
        exportService.export(BudgetPriorityDashboardFilter.empty(), ExportFormat.CSV, csvOutput);
        assertThat(csvOutput.toString(StandardCharsets.UTF_8).lines().count()).isEqualTo(4L);

        ByteArrayOutputStream excelOutput = new ByteArrayOutputStream();
        exportService.export(BudgetPriorityDashboardFilter.empty(), ExportFormat.XLSX, excelOutput);

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(excelOutput.toByteArray()))) {
            assertThat(workbook.getSheetAt(0).getPhysicalNumberOfRows()).isEqualTo(4);
            assertThat(workbook.getSheetAt(0).getRow(0).getCell(0).getStringCellValue()).isEqualTo("ID");
            assertThat(workbook.getSheetAt(0).getRow(0).getPhysicalNumberOfCells())
                    .isEqualTo(BudgetPriorityAnonymisedRecord.EXPORT_HEADERS.length);
        }
    }

    private List<String> headerTokens(String headerLine) {
        return Arrays.stream(headerLine.split(",")).map(String::trim).toList();
    }

    private boolean looksLikePiiHeader(String header) {
        String normalized = header.replace(" ", "").replace("_", "").toLowerCase(Locale.ROOT);
        return AnonymisationProjector.PII_JSON_KEYS.contains(normalized);
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
