package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecord;
import com.ionatech.nac.ygb.domain.valueobjects.PublicChartSeries;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardSummary;
import com.ionatech.nac.ygb.domain.valueobjects.PublicHeatmap;
import com.ionatech.nac.ygb.domain.valueobjects.HeatmapEntry;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;

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
            "devicesubmissionid"
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
