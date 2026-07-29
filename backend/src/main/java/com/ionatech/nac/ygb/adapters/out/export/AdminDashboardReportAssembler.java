package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DistrictCount;
import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriodCount;
import com.ionatech.nac.ygb.domain.valueobjects.FormTypeCount;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
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
                mapOverTime(aggregates.overTime())
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
}
