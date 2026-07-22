package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.export.CsvExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.ExcelExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.PdfExportWriter;
import com.ionatech.nac.ygb.adapters.out.export.SubmissionExportAdapter;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.api.ExportSubmissionsQuery;
import com.ionatech.nac.ygb.application.services.DashboardFilterHierarchyValidator;
import com.ionatech.nac.ygb.application.services.ExportSubmissionsService;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.IypSubmission;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
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
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({
        AdminSubmissionQueryJpaRepository.class,
        DashboardAggregationJpaRepository.class,
        DashboardAggregationRepositoryAdapter.class,
        CsvExportWriter.class,
        ExcelExportWriter.class,
        PdfExportWriter.class,
        SubmissionExportAdapter.class
})
class SubmissionExportIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private SubmissionJpaRepository submissionJpaRepository;

    @Autowired
    private AdminSubmissionQueryJpaRepository adminSubmissionQueryJpaRepository;

    @Autowired
    private DashboardAggregationRepositoryAdapter aggregationRepository;

    @Autowired
    private SubmissionExportAdapter exportAdapter;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ExportSubmissionsQuery exportService;
    private SubmissionRepositoryAdapter submissionRepository;

    private final UUID collectorId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final UUID aruaDistrictId = UUID.fromString("d1111111-1111-1111-1111-111111111111");
    private final UUID aruaSubcountyId = UUID.fromString("e2222222-2222-2222-2222-222222222222");
    private final UUID aruaParishId = UUID.fromString("b3333333-3333-3333-3333-333333333333");
    private final UUID aruaVillageId = UUID.fromString("f4444444-4444-4444-4444-444444444444");

    private final UUID kampalaDistrictId = UUID.fromString("a1111111-1111-1111-1111-111111111111");
    private final UUID kampalaSubcountyId = UUID.fromString("a2222222-2222-2222-2222-222222222222");
    private final UUID kampalaParishId = UUID.fromString("a3333333-3333-3333-3333-333333333333");
    private final UUID kampalaVillageId = UUID.fromString("a4444444-4444-4444-4444-444444444444");

    @BeforeEach
    void setUp() {
        SubmissionMapper submissionMapper = Mappers.getMapper(SubmissionMapper.class);
        submissionRepository = new SubmissionRepositoryAdapter(
                submissionJpaRepository,
                submissionMapper,
                adminSubmissionQueryJpaRepository,
                null
        );
        exportService = new ExportSubmissionsService(
                submissionRepository,
                aggregationRepository,
                new DashboardFilterHierarchyValidator(id -> java.util.Optional.empty()),
                exportAdapter
        );
        seedKampalaLocations();
        saveSampleSubmissions();
    }

    @Test
    void shouldExportCsvFilteredByDistrict() throws Exception {
        DashboardFilter aruaFilter = new DashboardFilter(
                aruaDistrictId, null, null, null, null, null, null, null, null, null
        );

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(aruaFilter, ExportFormat.CSV, output);

        List<String> lines = output.toString(StandardCharsets.UTF_8).lines().toList();
        assertThat(lines).hasSize(4);
        assertThat(lines.get(0)).startsWith("ID,Form Type,Respondent Name");
        assertThat(lines.stream().skip(1))
                .allMatch(line -> line.contains("Arua") && !line.contains("Kampala"));
    }

    @Test
    void shouldExportExcelWithHeaderRowAndTypedDateColumns() throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(DashboardFilter.empty(), ExportFormat.XLSX, output);

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(output.toByteArray()))) {
            Row header = workbook.getSheetAt(0).getRow(0);
            assertThat(header.getCell(0).getStringCellValue()).isEqualTo("ID");
            assertThat(header.getCell(5).getStringCellValue()).isEqualTo("Form Completed At");

            Row dataRow = workbook.getSheetAt(0).getRow(1);
            assertThat(dataRow.getCell(5).getCellType()).isEqualTo(CellType.NUMERIC);
            assertThat(DateUtil.isCellDateFormatted(dataRow.getCell(5))).isTrue();
        }
    }

    @Test
    @Tag("slow")
    void shouldExportFiftyThousandRowsWithoutTruncation() throws Exception {
        bulkInsertBypSubmissions(50_000);

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        exportService.export(DashboardFilter.empty(), ExportFormat.CSV, output);

        long lineCount = output.toString(StandardCharsets.UTF_8).lines().count();
        assertThat(lineCount).isEqualTo(50_005L);
    }

    private void bulkInsertBypSubmissions(int count) {
        LocalDateTime completedAt = LocalDateTime.of(2026, 3, 15, 10, 0);
        for (int index = 0; index < count; index++) {
            UUID submissionId = UUID.randomUUID();
            UUID deviceSubmissionId = UUID.randomUUID();
            jdbcTemplate.update(
                    """
                            INSERT INTO submissions (
                                id, collector_id, device_submission_id, form_completed_at, financial_year_period,
                                status, district_id, subcounty_id, parish_id, village_id,
                                respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'BYP')
                            """,
                    submissionId,
                    collectorId,
                    deviceSubmissionId,
                    completedAt,
                    "JAN_JUN_2026",
                    "SYNCED",
                    aruaDistrictId,
                    aruaSubcountyId,
                    aruaParishId,
                    aruaVillageId,
                    "Bulk Respondent " + index,
                    "0772" + String.format("%07d", index),
                    "FEMALE",
                    "AGE_20_24"
            );
            jdbcTemplate.update(
                    """
                            INSERT INTO byp_submissions (
                                id, exact_age, fund_receipt_duration, received_actual_amount_requested,
                                cash_amount_received, instalment_period, service_rating, performance_rating,
                                group_organized_transparently, received_bds, improvement_suggestion
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """,
                    submissionId,
                    22,
                    "ONE_WEEK",
                    true,
                    500000L,
                    "MONTHLY",
                    "VERY_GOOD",
                    "GOOD",
                    true,
                    true,
                    "Bulk export test suggestion."
            );
        }
    }

    private void seedKampalaLocations() {
        jdbcTemplate.update(
                "INSERT INTO locations (id, name, type, parent_id) VALUES (?, 'Kampala', 'DISTRICT', NULL)",
                kampalaDistrictId
        );
        jdbcTemplate.update(
                "INSERT INTO locations (id, name, type, parent_id) VALUES (?, 'Central', 'SUBCOUNTY', ?)",
                kampalaSubcountyId, kampalaDistrictId
        );
        jdbcTemplate.update(
                "INSERT INTO locations (id, name, type, parent_id) VALUES (?, 'Kisenyi I', 'PARISH', ?)",
                kampalaParishId, kampalaSubcountyId
        );
        jdbcTemplate.update(
                "INSERT INTO locations (id, name, type, parent_id) VALUES (?, 'Kakajjo Zone', 'VILLAGE', ?)",
                kampalaVillageId, kampalaParishId
        );
    }

    private void saveSampleSubmissions() {
        submissionRepository.save(createByp("Jane One", "FEMALE", aruaLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("Jane Two", "FEMALE", aruaLocation(), UUID.randomUUID()));
        submissionRepository.save(createByp("John Three", "MALE", aruaLocation(), UUID.randomUUID()));
        submissionRepository.save(createIyp("John Four", "MALE", kampalaLocation(), UUID.randomUUID()));
    }

    private Location aruaLocation() {
        return new Location(aruaDistrictId, aruaSubcountyId, aruaParishId, aruaVillageId);
    }

    private Location kampalaLocation() {
        return new Location(kampalaDistrictId, kampalaSubcountyId, kampalaParishId, kampalaVillageId);
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
