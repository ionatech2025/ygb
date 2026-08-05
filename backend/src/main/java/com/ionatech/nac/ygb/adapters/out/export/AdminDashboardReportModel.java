package com.ionatech.nac.ygb.adapters.out.export;

import java.util.List;

public record AdminDashboardReportModel(
        String filterDescription,
        String generatedAtLabel,
        long totalSubmissions,
        int districtsRepresented,
        int formTypesRepresented,
        List<ReportLabelCount> formTypes,
        List<ReportLabelCount> genders,
        List<ReportLabelCount> topDistricts,
        List<ReportLabelCount> financialYearPeriods,
        List<ReportLabelCount> submissionsOverTime,
        OpenDataUsageReportSection openDataUsage
) {
    public AdminDashboardReportModel {
        formTypes = List.copyOf(formTypes);
        genders = List.copyOf(genders);
        topDistricts = List.copyOf(topDistricts);
        financialYearPeriods = List.copyOf(financialYearPeriods);
        submissionsOverTime = List.copyOf(submissionsOverTime);
        if (openDataUsage == null) {
            openDataUsage = OpenDataUsageReportSection.empty();
        }
    }
}
