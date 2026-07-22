package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

final class DashboardFilterDescriptionBuilder {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;

    private DashboardFilterDescriptionBuilder() {
    }

    static String describe(DashboardFilter filter) {
        if (!filter.hasActiveCriteria()) {
            return "All submissions (no filters applied)";
        }
        List<String> parts = new ArrayList<>();
        if (filter.districtId() != null) {
            parts.add("districtId=" + filter.districtId());
        }
        if (filter.subcountyId() != null) {
            parts.add("subcountyId=" + filter.subcountyId());
        }
        if (filter.parishId() != null) {
            parts.add("parishId=" + filter.parishId());
        }
        if (filter.formType() != null) {
            parts.add("formType=" + filter.formType());
        }
        if (filter.dateFrom() != null) {
            parts.add("dateFrom=" + DATE_FORMAT.format(filter.dateFrom()));
        }
        if (filter.dateTo() != null) {
            parts.add("dateTo=" + DATE_FORMAT.format(filter.dateTo()));
        }
        if (filter.gender() != null) {
            parts.add("gender=" + filter.gender());
        }
        if (filter.ageGroup() != null) {
            parts.add("ageGroup=" + filter.ageGroup());
        }
        if (filter.collectorId() != null) {
            parts.add("collectorId=" + filter.collectorId());
        }
        if (filter.financialYearPeriod() != null) {
            parts.add("financialYearPeriod=" + filter.financialYearPeriod());
        }
        return String.join(", ", parts);
    }
}
