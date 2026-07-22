package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.export.PublicCsvExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.PublicExcelExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.PublicExportAdapter;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.ExportPublicDatasetQuery;
import com.ionatech.nac.ygb.application.services.DashboardFilterHierarchyValidator;
import com.ionatech.nac.ygb.application.services.ExportPublicDatasetService;
import com.ionatech.nac.ygb.application.services.PublicDashboardFilterMapper;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.IypSubmission;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
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
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({
        PublicAnonymisedExportJpaRepository.class,
        PublicAnonymisedExportRepositoryAdapter.class,
        PublicCsvExportWriter.class,
        PublicExcelExportWriter.class,
        PublicExportAdapter.class
})
class PublicExportIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private PublicAnonymisedExportRepositoryAdapter exportRepository;

    @Autowired
    private PublicExportAdapter publicExportAdapter;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ExportPublicDatasetQuery exportService;
    private SubmissionRepositoryAdapter submissionRepository;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(submissionJpaRepository, submissionMapper, null, null);
        exportService = new ExportPublicDatasetService(
                exportRepository,
                new DashboardFilterHierarchyValidator(id -> java.util.Optional.empty()),
                publicExportAdapter,
                new AnonymisationProjector()
        );
        TestLocationFixtures.clearAllSubmissions(jdbcTemplate);
        saveSampleSubmissions();
    }

    @Test
    void shouldExportCsvFilteredByDistrictWithoutPiiColumns() throws Exception {
        PublicDashboardFilter publicFilter = new PublicDashboardFilter(
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID, null, null, null, null, null, null, null, null, null
        );

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(publicFilter, ExportFormat.CSV, output);

        List<String> lines = output.toString(StandardCharsets.UTF_8).lines().toList();
        assertThat(lines).hasSize(4);
        assertThat(lines.getFirst()).isEqualTo(String.join(",", PublicAnonymisedRecord.EXPORT_HEADERS));
        assertThat(headerTokens(lines.getFirst()))
                .noneMatch(this::looksLikePiiHeader);
        assertThat(lines.stream().skip(1))
                .allMatch(line -> line.contains(TestLocationFixtures.NTUNGAMO_DISTRICT_NAME)
                        && !line.contains(TestLocationFixtures.KAMPALA_DISTRICT_NAME)
                        && !line.contains("Jane One")
                        && !line.contains("0772"));
    }

    @Test
    void shouldExportFullDatasetWithoutFilters() throws Exception {
        ByteArrayOutputStream csvOutput = new ByteArrayOutputStream();
        exportService.export(PublicDashboardFilter.empty(), ExportFormat.CSV, csvOutput);

        assertThat(csvOutput.toString(StandardCharsets.UTF_8).lines().count()).isEqualTo(5L);

        ByteArrayOutputStream excelOutput = new ByteArrayOutputStream();
        exportService.export(PublicDashboardFilter.empty(), ExportFormat.XLSX, excelOutput);

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(excelOutput.toByteArray()))) {
            assertThat(workbook.getSheetAt(0).getPhysicalNumberOfRows()).isEqualTo(5);
            assertThat(workbook.getSheetAt(0).getRow(0).getCell(0).getStringCellValue()).isEqualTo("ID");
            assertThat(workbook.getSheetAt(0).getRow(0).getPhysicalNumberOfCells()).isEqualTo(PublicAnonymisedRecord.EXPORT_HEADERS.length);
        }
    }

    @Test
    void publicFilterShouldMatchAdminAndSemanticsForDistrictExport() throws Exception {
        DashboardFilter adminFilter = new DashboardFilter(
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID, null, null, null, null, null, null, null, null, null
        );
        PublicDashboardFilter publicFilter = new PublicDashboardFilter(
                TestLocationFixtures.NTUNGAMO_DISTRICT_ID, null, null, null, null, null, null, null, null, null
        );

        assertThat(PublicDashboardFilterMapper.toDashboardFilter(publicFilter)).isEqualTo(adminFilter);

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(publicFilter, ExportFormat.CSV, output);
        assertThat(output.toString(StandardCharsets.UTF_8).lines().count()).isEqualTo(4L);
    }

    private List<String> headerTokens(String headerLine) {
        return Arrays.stream(headerLine.split(",")).map(String::trim).toList();
    }

    private boolean looksLikePiiHeader(String header) {
        String normalized = header.replace(" ", "").replace("_", "").toLowerCase(Locale.ROOT);
        return AnonymisationProjector.PII_JSON_KEYS.contains(normalized);
    }

    private void saveSampleSubmissions() {
        submissionRepository.save(createByp("Jane One", "FEMALE", TestLocationFixtures.ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("Jane Two", "FEMALE", TestLocationFixtures.ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("John Three", "MALE", TestLocationFixtures.ntungamoLocation(), UUID.randomUUID()));
        submissionRepository.save(createIyp("John Four", "MALE", TestLocationFixtures.kampalaLocation(), UUID.randomUUID()));
    }

    private SubmissionMetadata metadata(UUID deviceSubmissionId) {
        return new SubmissionMetadata(collectorId, deviceSubmissionId, LocalDateTime.of(2026, 3, 15, 10, 0));
    }

    private BypSubmission createByp(String name, String gender, Location location, UUID deviceSubmissionId) {
        return new BypSubmission(
                UUID.randomUUID(),
                metadata(deviceSubmissionId),
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
