package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.Locale;
import java.util.Set;

/** Strips or rejects PII before data leaves public-facing query/export paths. */
public final class AnonymisationProjector {

    public static final Set<String> PII_JSON_KEYS = Set.of(
            "phone",
            "phonenumber",
            "respondentphone",
            "respondentname",
            "fullname",
            "name",
            "collectorid",
            "collectorname",
            "collector",
            "devicesubmissionid",
            "demographicdata",
            "demographic_data",
            "rationale",
            "recommendations",
            "recommendation",
            "submissionid",
            "lbaid",
            "collectoruserid"
    );

    public PublicAnonymisedRecord fromSubmissionSummary(SubmissionSummary summary) {
        if (summary == null) {
            throw new IllegalArgumentException("SubmissionSummary must not be null.");
        }
        return new PublicAnonymisedRecord(
                summary.id(),
                summary.formType(),
                summary.districtId(),
                summary.districtName(),
                null,
                null,
                summary.formCompletedAt(),
                summary.status(),
                summary.financialYearPeriod()
        );
    }

    public void assertNoPiiJsonKeys(Iterable<String> jsonKeys) {
        for (String key : jsonKeys) {
            if (key != null && PII_JSON_KEYS.contains(normalizeKey(key))) {
                throw new PublicPiiExposureException("Public response must not expose PII field: " + key);
            }
        }
    }

    public void assertExportHeadersSafe() {
        assertNoPiiJsonKeys(PublicAnonymisedRecord.exportHeaderKeys());
    }

    public void assertBudgetPriorityExportHeadersSafe() {
        assertNoPiiJsonKeys(BudgetPriorityAnonymisedRecord.exportHeaderKeys());
    }

    public void assertLgoBudgetAllocationExportHeadersSafe() {
        assertNoPiiJsonKeys(LgoBudgetAllocationAnonymisedRecord.exportHeaderKeys());
    }

    public PublicAnonymisedRecord assertExportRecord(PublicAnonymisedRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("PublicAnonymisedRecord must not be null.");
        }
        return record;
    }

    public BudgetPriorityAnonymisedRecord assertBudgetPriorityExportRecord(BudgetPriorityAnonymisedRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("BudgetPriorityAnonymisedRecord must not be null.");
        }
        return record;
    }

    public LgoBudgetAllocationAnonymisedRecord assertLgoBudgetAllocationExportRecord(
            LgoBudgetAllocationAnonymisedRecord record
    ) {
        if (record == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationAnonymisedRecord must not be null.");
        }
        return record;
    }

    public PublicDashboardSummary assertAnonymisedSummary(PublicDashboardSummary summary) {
        if (summary == null) {
            throw new IllegalArgumentException("PublicDashboardSummary must not be null.");
        }
        return summary;
    }

    public PublicChartSeries assertAnonymisedChartSeries(PublicChartSeries series) {
        if (series == null) {
            throw new IllegalArgumentException("PublicChartSeries must not be null.");
        }
        return series;
    }

    public BudgetPrioritySummary assertAnonymisedBudgetPrioritySummary(BudgetPrioritySummary summary) {
        if (summary == null) {
            throw new IllegalArgumentException("BudgetPrioritySummary must not be null.");
        }
        for (BudgetPriorityAreaCount area : summary.topPriorityAreas()) {
            if (looksLikePhoneNumber(area.priorityArea())) {
                throw new PublicPiiExposureException("Public budget priority summary must not expose phone-like labels.");
            }
        }
        return summary;
    }

    public BudgetPriorityChartSeries assertAnonymisedBudgetPriorityChartSeries(BudgetPriorityChartSeries series) {
        if (series == null) {
            throw new IllegalArgumentException("BudgetPriorityChartSeries must not be null.");
        }
        for (BudgetPriorityChartDataPoint point : series.data()) {
            if (looksLikePhoneNumber(point.label())) {
                throw new PublicPiiExposureException("Public budget priority chart must not expose phone-like labels.");
            }
        }
        return series;
    }

    public LgoBudgetAllocationSummary assertAnonymisedLgoBudgetAllocationSummary(LgoBudgetAllocationSummary summary) {
        if (summary == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationSummary must not be null.");
        }
        for (LgoBudgetAllocationDistrictCount district : summary.byDistrict()) {
            if (looksLikePhoneNumber(district.districtLabel())) {
                throw new PublicPiiExposureException("Public LGO budget allocation summary must not expose phone-like labels.");
            }
        }
        for (LgoBudgetAllocationSectorCount sector : summary.topSectors()) {
            if (looksLikePhoneNumber(sector.sector())) {
                throw new PublicPiiExposureException("Public LGO budget allocation summary must not expose phone-like labels.");
            }
        }
        return summary;
    }

    public LgoBudgetAllocationChartSeries assertAnonymisedLgoBudgetAllocationChartSeries(
            LgoBudgetAllocationChartSeries series
    ) {
        if (series == null) {
            throw new IllegalArgumentException("LgoBudgetAllocationChartSeries must not be null.");
        }
        for (BudgetPriorityChartDataPoint point : series.data()) {
            if (looksLikePhoneNumber(point.label())) {
                throw new PublicPiiExposureException("Public LGO budget allocation chart must not expose phone-like labels.");
            }
        }
        return series;
    }

    public PublicHeatmap assertAnonymisedHeatmap(PublicHeatmap heatmap) {
        if (heatmap == null) {
            throw new IllegalArgumentException("PublicHeatmap must not be null.");
        }
        for (HeatmapEntry entry : heatmap.entries()) {
            if (entry.label() != null && looksLikePhoneNumber(entry.label())) {
                throw new PublicPiiExposureException("Public heatmap must not expose phone-like labels.");
            }
        }
        return heatmap;
    }

    private static boolean looksLikePhoneNumber(String value) {
        String digits = value.replaceAll("\\D", "");
        return digits.length() >= 9;
    }

    private static String normalizeKey(String key) {
        return key.replace("_", "").toLowerCase(Locale.ROOT);
    }
}
