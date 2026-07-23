package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

final class LgoBudgetAllocationFilterSqlSupport {

    private LgoBudgetAllocationFilterSqlSupport() {
    }

    static String baseFromClause() {
        return """
                 FROM lgo_budget_allocations lba
                 JOIN submissions s ON s.id = lba.submission_id
                """;
    }

    static String whereClause(LgoBudgetAllocationDashboardFilter filter, Map<String, Object> params) {
        StringBuilder where = new StringBuilder(" WHERE s.form_type = 'LGO_BUDGET_ALLOCATION' ");
        appendLocation(where, params, "district_id", "districtId", filter.districtId());
        appendLocation(where, params, "subcounty_id", "subcountyId", filter.subcountyId());
        appendLocation(where, params, "parish_id", "parishId", filter.parishId());
        if (filter.gender() != null) {
            where.append(" AND s.respondent_gender = :gender ");
            params.put("gender", filter.gender());
        }
        if (filter.ageGroup() != null) {
            where.append(" AND s.respondent_age_group = :ageGroup ");
            params.put("ageGroup", filter.ageGroup());
        }
        if (filter.financialYearPeriod() != null) {
            where.append(" AND s.financial_year_period = :financialYearPeriod ");
            params.put("financialYearPeriod", filter.financialYearPeriod());
        }
        appendDateRange(where, params, filter.dateFrom(), filter.dateTo());
        return where.toString();
    }

    private static void appendLocation(
            StringBuilder where,
            Map<String, Object> params,
            String columnName,
            String paramName,
            UUID value
    ) {
        if (value == null) {
            return;
        }
        where.append(" AND s.").append(columnName).append(" = :").append(paramName).append(' ');
        params.put(paramName, value);
    }

    private static void appendDateRange(
            StringBuilder where,
            Map<String, Object> params,
            LocalDate dateFrom,
            LocalDate dateTo
    ) {
        if (dateFrom != null) {
            where.append(" AND lba.submitted_at >= :dateFrom ");
            params.put("dateFrom", dateFrom.atStartOfDay());
        }
        if (dateTo != null) {
            where.append(" AND lba.submitted_at < :dateToExclusive ");
            params.put("dateToExclusive", dateTo.plusDays(1).atStartOfDay());
        }
    }
}
