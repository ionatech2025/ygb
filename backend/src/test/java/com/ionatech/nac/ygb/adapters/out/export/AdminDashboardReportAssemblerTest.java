package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroupCount;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.DistrictCount;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriodCount;
import com.ionatech.nac.ygb.domain.valueobjects.FormTypeCount;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AdminDashboardReportAssemblerTest {

    private final AdminDashboardReportAssembler assembler = new AdminDashboardReportAssembler();

    @Test
    void assembleMapsAggregatesIntoReportSections() {
        UUID districtA = UUID.fromString("11111111-1111-1111-1111-111111111111");
        UUID districtB = UUID.fromString("22222222-2222-2222-2222-222222222222");
        DashboardAggregates aggregates = new DashboardAggregates(
                42,
                List.of(
                        new DistrictCount("Kampala", districtA, 20),
                        new DistrictCount("Ntungamo", districtB, 8)
                ),
                List.of(new GenderCount("MALE", 25), new GenderCount("FEMALE", 17)),
                List.of(
                        new TimeSeriesPoint(LocalDate.of(2026, 3, 1), 10),
                        new TimeSeriesPoint(LocalDate.of(2026, 3, 8), 32)
                ),
                List.of(new FormTypeCount(FormType.BYP, 30), new FormTypeCount(FormType.IYP, 12)),
                List.of(new FinancialYearPeriodCount("JAN_JUN_2026", 42))
        );

        AdminDashboardReportModel report = assembler.assemble(
                DashboardFilter.empty(),
                aggregates,
                LocalDateTime.of(2026, 7, 29, 12, 0)
        );

        assertEquals("All submissions (no filters applied)", report.filterDescription());
        assertEquals("2026-07-29 12:00:00", report.generatedAtLabel());
        assertEquals(42, report.totalSubmissions());
        assertEquals(2, report.districtsRepresented());
        assertEquals(2, report.formTypesRepresented());
        assertEquals(2, report.formTypes().size());
        assertEquals("Male", report.genders().getFirst().label());
        assertEquals("Kampala", report.topDistricts().getFirst().label());
        assertEquals(20, report.topDistricts().getFirst().count());
        assertTrue(report.submissionsOverTime().get(1).count() > report.submissionsOverTime().getFirst().count());
        assertEquals(0, report.openDataUsage().totalDownloads());
    }

    @Test
    void assembleMapsOpenDataUsageWithoutContactFields() {
        DownloadUsageAggregates downloadUsage = new DownloadUsageAggregates(
                3L,
                7L,
                List.of(new GenderCount("FEMALE", 2L)),
                List.of(new AgeGroupCount("AGE_18_24", 3L)),
                List.of(new DatasetDownloadCount("PDM", 4L), new DatasetDownloadCount("BUDGET_PRIORITIES", 3L)),
                List.of(new TimeSeriesPoint(LocalDate.of(2026, 8, 4), 7L))
        );
        VisitsVsDownloadsComparison visits = new VisitsVsDownloadsComparison(15L, 3L, List.of());

        AdminDashboardReportModel report = assembler.assemble(
                DashboardFilter.empty(),
                new DashboardAggregates(0, List.of(), List.of(), List.of(), List.of(), List.of()),
                downloadUsage,
                visits,
                LocalDateTime.of(2026, 8, 4, 12, 0)
        );

        OpenDataUsageReportSection usage = report.openDataUsage();
        assertEquals(15, usage.totalUniqueVisitors());
        assertEquals(3, usage.totalUniqueDownloaders());
        assertEquals(7, usage.totalDownloads());
        assertEquals("PDM", usage.byDataset().getFirst().label());
        assertEquals("Budget Priorities", usage.byDataset().get(1).label());
        assertEquals("Female", usage.byGender().getFirst().label());
        assertEquals("18-24", usage.byAgeGroup().getFirst().label());
    }

    @Test
    void toUsageFilterUsesDashboardDateGenderAndAgeOnly() {
        DashboardFilter filter = new DashboardFilter(
                UUID.randomUUID(),
                null,
                null,
                FormType.BYP,
                LocalDate.of(2026, 8, 1),
                LocalDate.of(2026, 8, 31),
                "FEMALE",
                "AGE_18_24",
                null,
                null
        );

        DownloadUsageFilter usageFilter = AdminDashboardReportAssembler.toUsageFilter(filter);

        assertEquals("FEMALE", usageFilter.gender());
        assertEquals("AGE_18_24", usageFilter.ageGroup());
        assertEquals(LocalDate.of(2026, 8, 1), usageFilter.dateFrom());
        assertEquals(LocalDate.of(2026, 8, 31), usageFilter.dateTo());
        assertEquals(null, usageFilter.countryCode());
        assertEquals(null, usageFilter.dataset());
    }
}
