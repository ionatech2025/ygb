package com.ionatech.nac.ygb.adapters.out.export;

import java.util.List;

/** Aggregate-only open-data usage for donor PDF — no emails or names. */
public record OpenDataUsageReportSection(
        long totalUniqueVisitors,
        long totalUniqueDownloaders,
        long totalDownloads,
        List<ReportLabelCount> byDataset,
        List<ReportLabelCount> byGender,
        List<ReportLabelCount> byAgeGroup,
        List<ReportLabelCount> downloadsOverTime
) {
    public OpenDataUsageReportSection {
        byDataset = List.copyOf(byDataset);
        byGender = List.copyOf(byGender);
        byAgeGroup = List.copyOf(byAgeGroup);
        downloadsOverTime = List.copyOf(downloadsOverTime);
    }

    public static OpenDataUsageReportSection empty() {
        return new OpenDataUsageReportSection(0, 0, 0, List.of(), List.of(), List.of(), List.of());
    }
}
