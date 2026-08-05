package com.ionatech.nac.ygb.adapters.out.export;

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
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Component
public class AdminDashboardReportAssembler {

    private static final DateTimeFormatter GENERATED_AT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final int TOP_DISTRICT_LIMIT = 10;

    public AdminDashboardReportModel assemble(
            DashboardFilter filter,
            DashboardAggregates aggregates,
            LocalDateTime generatedAt
    ) {
        return assemble(filter, aggregates, null, null, generatedAt);
    }

    public AdminDashboardReportModel assemble(
            DashboardFilter filter,
            DashboardAggregates aggregates,
            DownloadUsageAggregates downloadUsage,
            VisitsVsDownloadsComparison visitsVsDownloads,
            LocalDateTime generatedAt
    ) {
        return new AdminDashboardReportModel(
                DashboardFilterDescriptionBuilder.describe(filter),
                GENERATED_AT.format(generatedAt),
                aggregates.totalSubmissions(),
                aggregates.byDistrict().size(),
                aggregates.byFormType().size(),
                mapFormTypes(aggregates.byFormType()),
                mapGenders(aggregates.byGender()),
                mapTopDistricts(aggregates.byDistrict()),
                mapFinancialYearPeriods(aggregates.byFinancialYearPeriod()),
                mapOverTime(aggregates.overTime()),
                mapOpenDataUsage(downloadUsage, visitsVsDownloads)
        );
    }

    /**
     * Usage analytics follow the dashboard date range (and gender/age when set).
     * Location/form-type filters do not apply to download/visit events.
     */
    public static DownloadUsageFilter toUsageFilter(DashboardFilter filter) {
        if (filter == null) {
            return DownloadUsageFilter.empty();
        }
        return new DownloadUsageFilter(
                filter.gender(),
                filter.ageGroup(),
                null,
                null,
                null,
                filter.dateFrom(),
                filter.dateTo()
        );
    }

    OpenDataUsageReportSection mapOpenDataUsage(
            DownloadUsageAggregates downloadUsage,
            VisitsVsDownloadsComparison visitsVsDownloads
    ) {
        if (downloadUsage == null && visitsVsDownloads == null) {
            return OpenDataUsageReportSection.empty();
        }
        long visitors = visitsVsDownloads != null ? visitsVsDownloads.totalUniqueVisitors() : 0L;
        long downloaders = visitsVsDownloads != null
                ? visitsVsDownloads.totalUniqueDownloaders()
                : (downloadUsage != null ? downloadUsage.totalDownloaders() : 0L);
        long downloads = downloadUsage != null ? downloadUsage.totalDownloads() : 0L;
        return new OpenDataUsageReportSection(
                visitors,
                downloaders,
                downloads,
                downloadUsage != null ? mapDatasets(downloadUsage.byDataset()) : List.of(),
                downloadUsage != null ? mapGenders(downloadUsage.byGender()) : List.of(),
                downloadUsage != null ? mapAgeGroups(downloadUsage.byAgeGroup()) : List.of(),
                downloadUsage != null ? mapOverTime(downloadUsage.downloadsOverTime()) : List.of()
        );
    }

    private List<ReportLabelCount> mapFormTypes(List<FormTypeCount> rows) {
        return rows.stream()
                .map(row -> new ReportLabelCount(row.formType().name(), row.count()))
                .toList();
    }

    private List<ReportLabelCount> mapGenders(List<GenderCount> rows) {
        return rows.stream()
                .map(row -> new ReportLabelCount(formatGender(row.gender()), row.count()))
                .toList();
    }

    private List<ReportLabelCount> mapAgeGroups(List<AgeGroupCount> rows) {
        return rows.stream()
                .map(row -> new ReportLabelCount(formatAgeGroup(row.ageGroup()), row.count()))
                .toList();
    }

    private List<ReportLabelCount> mapDatasets(List<DatasetDownloadCount> rows) {
        return rows.stream()
                .map(row -> new ReportLabelCount(formatDataset(row.dataset()), row.count()))
                .toList();
    }

    private List<ReportLabelCount> mapTopDistricts(List<DistrictCount> rows) {
        return rows.stream()
                .sorted(Comparator.comparingLong(DistrictCount::count).reversed())
                .limit(TOP_DISTRICT_LIMIT)
                .map(row -> new ReportLabelCount(row.districtName(), row.count()))
                .toList();
    }

    private List<ReportLabelCount> mapFinancialYearPeriods(List<FinancialYearPeriodCount> rows) {
        return rows.stream()
                .map(row -> new ReportLabelCount(row.financialYearPeriod(), row.count()))
                .toList();
    }

    private List<ReportLabelCount> mapOverTime(List<TimeSeriesPoint> rows) {
        return rows.stream()
                .sorted(Comparator.comparing(TimeSeriesPoint::bucketStart))
                .map(row -> new ReportLabelCount(row.bucketStart().toString(), row.count()))
                .toList();
    }

    private String formatGender(String gender) {
        return switch (gender) {
            case "MALE" -> "Male";
            case "FEMALE" -> "Female";
            default -> gender;
        };
    }

    private String formatAgeGroup(String ageGroup) {
        return switch (ageGroup) {
            case "AGE_BELOW_18" -> "Below 18";
            case "AGE_18_24" -> "18-24";
            case "AGE_25_29" -> "25-29";
            case "AGE_30_35" -> "30-35";
            case "AGE_ABOVE_35" -> "Above 35";
            default -> ageGroup;
        };
    }

    private String formatDataset(String dataset) {
        return switch (dataset) {
            case "PDM" -> "PDM";
            case "BUDGET_PRIORITIES" -> "Budget Priorities";
            case "LGO_BUDGET_ALLOCATION" -> "LGO Budget Allocation";
            default -> dataset;
        };
    }
}
