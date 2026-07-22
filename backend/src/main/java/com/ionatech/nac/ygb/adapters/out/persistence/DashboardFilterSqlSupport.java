package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

final class DashboardFilterSqlSupport {

    private DashboardFilterSqlSupport() {
    }

    static String whereClause(DashboardFilter filter, Map<String, Object> params) {
        return appendPredicates(filter, params, "s");
    }

    /** Submission-table predicates without the leading {@code WHERE 1=1} (for JOIN ON clauses). */
    static String andPredicates(DashboardFilter filter, Map<String, Object> params, String alias) {
        return appendPredicates(filter, params, alias).substring(" WHERE 1=1".length());
    }

    private static String appendPredicates(DashboardFilter filter, Map<String, Object> params, String alias) {
        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        appendUuid(where, params, alias, "district_id", "districtId", filter.districtId());
        appendUuid(where, params, alias, "subcounty_id", "subcountyId", filter.subcountyId());
        appendUuid(where, params, alias, "parish_id", "parishId", filter.parishId());
        appendUuid(where, params, alias, "collector_id", "collectorId", filter.collectorId());

        if (filter.formType() != null) {
            where.append(" AND ").append(alias).append(".form_type = :formType ");
            params.put("formType", filter.formType().name());
        }
        if (filter.gender() != null) {
            where.append(" AND ").append(alias).append(".respondent_gender = :gender ");
            params.put("gender", filter.gender());
        }
        if (filter.ageGroup() != null) {
            where.append(" AND ").append(alias).append(".respondent_age_group = :ageGroup ");
            params.put("ageGroup", filter.ageGroup());
        }
        if (filter.financialYearPeriod() != null) {
            where.append(" AND ").append(alias).append(".financial_year_period = :financialYearPeriod ");
            params.put("financialYearPeriod", filter.financialYearPeriod());
        }
        appendDateRange(where, params, alias, filter.dateFrom(), filter.dateTo());
        return where.toString();
    }

    private static void appendUuid(
            StringBuilder where,
            Map<String, Object> params,
            String alias,
            String column,
            String paramName,
            UUID value
    ) {
        if (value == null) {
            return;
        }
        where.append(" AND ").append(alias).append('.').append(column).append(" = :").append(paramName).append(' ');
        params.put(paramName, value);
    }

    private static void appendDateRange(
            StringBuilder where,
            Map<String, Object> params,
            String alias,
            LocalDate dateFrom,
            LocalDate dateTo
    ) {
        if (dateFrom != null) {
            where.append(" AND ").append(alias).append(".form_completed_at >= :dateFrom ");
            params.put("dateFrom", dateFrom.atStartOfDay());
        }
        if (dateTo != null) {
            where.append(" AND ").append(alias).append(".form_completed_at < :dateToExclusive ");
            params.put("dateToExclusive", dateTo.plusDays(1).atStartOfDay());
        }
    }
}
